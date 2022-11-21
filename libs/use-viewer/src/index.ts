import { useEffect, useRef } from 'react';
import useState from 'react-usestateref';
import { useErrorHandler } from 'react-error-boundary';
import { Director, LayerInfo, MediaLayer, MediaStreamLayers, MediaTrackInfo, View, ViewerCount } from '@millicast/sdk';
import { MediaStreamSource, ViewOptions, BroadcastEvent, ViewProjectSourceMapping } from '@millicast/sdk';

import type { StreamStats } from '@millicast/sdk';

export type ViewerState = 'initial' | 'ready' | 'connecting' | 'liveOn' | 'liveOff';

export type StreamQuality = 'Auto' | 'High' | 'Medium' | 'Low';

export type SimulcastQuality = {
  streamQuality: StreamQuality;
  simulcastLayer?: LayerInfo; // Auto has an idx of null
};

export type RemoteTrackSource = {
  mediaStream: MediaStream;
  videoMediaId?: string;
  audioMediaId?: string;
};

type SourceId = string;

export type Viewer = {
  viewerState: ViewerState;
  mainStream?: MediaStream;
  setupViewer: (streamName: string, streamAccountId: string, mainSourceId?: SourceId, subscriberToken?: string) => void;
  stopViewer: () => void;
  startViewer: (options?: ViewOptions) => void;
  projectRemoteTrackToMain: (sourceId: SourceId) => void;
  remoteTrackSources: Map<SourceId, RemoteTrackSource>;
  viewerCount: number;
  streamQualityOptions: SimulcastQuality[];
  updateStreamQuality: (selectedQuality: StreamQuality) => void;
  statistics?: StreamStats;
};

const useViewer = (): Viewer => {
  const [viewerState, setViewerState] = useState<ViewerState>('initial');
  const [remoteTrackSources, setRemoteTrackSources, remoteTrackSourcesRef] = useState<Map<SourceId, RemoteTrackSource>>(
    new Map()
  );
  const [mainStream, setMainStream, mainStreamRef] = useState<MediaStream>();
  const [statistics, setStatistics] = useState<StreamStats>();
  const millicastView = useRef<View>();
  const mainSourceIdRef = useRef<SourceId>('mainSource');
  const mainVideoMidRef = useRef<string>();
  const mainAudioMidRef = useRef<string>();
  const [viewerCount, setViewerCount] = useState<number>(0);
  const handleError = useErrorHandler();
  const streamQuality = useRef<StreamQuality>();
  const [streamQualityOptions, setStreamQualityOptions] = useState<SimulcastQuality[]>([{ streamQuality: 'Auto' }]);

  useEffect(() => {
    switch (viewerState) {
      case 'liveOff':
        millicastView.current?.webRTCPeer?.stopStats();
        break;
      case 'liveOn':
        {
          millicastView.current?.webRTCPeer?.initStats();
          millicastView.current?.webRTCPeer?.on('stats', (statistics) => {
            // we will only feed main stream statistics in this stage
            const videoInbounds = statistics.video.inbounds.filter((stats) => stats.mid === mainVideoMidRef.current);
            if (videoInbounds) statistics.video.inbounds = videoInbounds;
            const audioInbounds = statistics.audio.inbounds.filter((stats) => stats.mid === mainAudioMidRef.current);
            if (audioInbounds) statistics.audio.inbounds = audioInbounds;
            setStatistics(statistics);
          });
        }
        break;
      default:
        break;
    }
  }, [viewerState]);

  const constructLayers = (layers: MediaLayer[]) => {
    if (layers.length > 3 || layers.length < 2) return;
    const qualities: StreamQuality[] = layers.length === 3 ? ['High', 'Medium', 'Low'] : ['High', 'Low'];
    const newStreamQualityOptions: SimulcastQuality[] = layers.map((layer, idx) => {
      return {
        streamQuality: qualities[idx],
        simulcastLayer: {
          encodingId: layer.id,
          bitrate: layer.bitrate,
          simulcastIdx: layer.simulcastIdx,
          spatialLayerId: layer.layers[0]?.spatialLayerId, // H264 doesn't have layers.
          temporalLayerId: layer.layers[0]?.temporalLayerId, // H264 doesn't have layers.
        },
      };
    });
    newStreamQualityOptions.unshift({
      streamQuality: 'Auto',
    });
    setStreamQualityOptions(newStreamQualityOptions);
  };

  const updateStreamQuality = (selectedQuality: StreamQuality) => {
    if (!millicastView.current) return;
    const option = streamQualityOptions.find((option) => option.streamQuality === selectedQuality);
    if (!option) return;
    streamQuality.current = selectedQuality;
    if (selectedQuality === 'Auto') {
      millicastView.current.select({});
    } else {
      millicastView.current.select(option.simulcastLayer);
    }
  };

  const setupViewer = (
    streamName: string,
    streamAccountId: string,
    mainSourceId?: SourceId,
    subscriberToken?: string
  ) => {
    if (millicastView.current?.isActive()) stopViewer();
    const tokenGenerator = () => Director.getSubscriber({ streamName, streamAccountId, subscriberToken });
    millicastView.current = new View(streamName, tokenGenerator);
    if (mainSourceId) mainSourceIdRef.current = mainSourceId;
    millicastView.current.on('track', (event: RTCTrackEvent) => {
      if (event.streams.length === 0) return; // other sources
      if (event.track.kind === 'video') mainVideoMidRef.current = event.transceiver.mid ?? undefined;
      else if (event.track.kind === 'audio') mainAudioMidRef.current = event.transceiver.mid ?? undefined;
      if (!mainStreamRef.current || mainStreamRef.current.id !== event.streams[0].id) {
        setMainStream(event.streams[0]);
      }
    });
    millicastView.current.on('broadcastEvent', (event: BroadcastEvent) => {
      switch (event.name) {
        case 'active':
          {
            const source = event.data as MediaStreamSource;
            if (!source.sourceId) source.sourceId = mainSourceIdRef.current;
            if (source.sourceId === mainSourceIdRef.current) {
              setViewerState('liveOn');
              return; // we don't add and project main source in this stage
            }
            addRemoteVideoTrackAndProject(source.sourceId, source.tracks);
          }
          break;
        case 'inactive':
          {
            const source = event.data as MediaStreamSource;
            if (!source.sourceId) source.sourceId = mainSourceIdRef.current;
            if (source.sourceId === mainSourceIdRef.current) {
              setViewerState('liveOff');
              return;
            }
            unprojectAndRemoveRemoteTrack(source.sourceId);
          }
          break;
        case 'viewercount':
          setViewerCount((event.data as ViewerCount).viewercount);
          break;
        case 'layers': {
          // We only check active layers for main stream which always has media id 0
          const layers = (event.data as MediaStreamLayers).medias['0']?.active;
          if (!layers || layers.length == 0) {
            setStreamQualityOptions([]);
            return;
          }
          constructLayers(layers);
          if (!streamQuality.current) {
            streamQuality.current = 'Auto';
            millicastView.current?.select({});
          }
          break;
        }
      }
    });
    setViewerState('ready');
  };

  const startViewer = async (options?: ViewOptions) => {
    if (!millicastView.current) {
      handleError('Please set up Viewer first');
      return;
    }
    if (millicastView.current.isActive()) return;
    try {
      setViewerState('connecting');
      await millicastView.current.connect(options);
    } catch (error) {
      console.error(error);
      millicastView.current.reconnect();
    }
  };

  const stopViewer = () => {
    millicastView.current?.stop();
  };

  const addRemoteVideoTrackAndProject = async (sourceId: SourceId, trackInfos: MediaTrackInfo[]) => {
    if (!millicastView.current) return;
    let videoTransceiver: RTCRtpTransceiver | undefined;
    let audioTransceiver: RTCRtpTransceiver | undefined;
    const mediaStream = new MediaStream();
    const mapping: ViewProjectSourceMapping[] = [];
    const trackSource: RemoteTrackSource = { mediaStream };
    let trackInfo = trackInfos.find((info) => info.media == 'video');
    if (trackInfo) {
      videoTransceiver = await millicastView.current.addRemoteTrack('video', [mediaStream]);
      const videoMid = videoTransceiver?.mid ?? undefined;
      if (videoMid) {
        mapping.push({ trackId: trackInfo.trackId, mediaId: videoMid, media: trackInfo.media });
        trackSource.videoMediaId = videoMid;
      }
    }
    trackInfo = trackInfos.find((info) => info.media == 'audio');
    if (trackInfo) {
      audioTransceiver = await millicastView.current.addRemoteTrack('audio', [mediaStream]);
      const audioMid = audioTransceiver?.mid ?? undefined;
      if (audioMid) {
        mapping.push({ trackId: trackInfo.trackId, mediaId: audioMid, media: trackInfo.media });
        trackSource.audioMediaId = audioMid;
      }
    }
    if (mapping.length === 0) {
      console.error('No valid video or audio track');
      return;
    }
    try {
      await millicastView.current?.project(sourceId === mainSourceIdRef.current ? undefined : sourceId, mapping);
      const newRemoteTrackSources = new Map(remoteTrackSourcesRef.current);
      newRemoteTrackSources.set(sourceId, trackSource);
      setRemoteTrackSources(newRemoteTrackSources);
    } catch (err) {
      console.error('failed to project', sourceId, err);
    }
  };

  const unprojectAndRemoveRemoteTrack = async (sourceId: SourceId) => {
    if (!millicastView.current) return;
    const remoteTrackSource = remoteTrackSourcesRef.current.get(sourceId);
    if (!remoteTrackSource) return;
    const mids = [];
    if (remoteTrackSource.videoMediaId) mids.push(remoteTrackSource.videoMediaId);
    if (remoteTrackSource.audioMediaId) mids.push(remoteTrackSource.audioMediaId);
    if (mids.length === 0) return;
    try {
      await millicastView.current.unproject(mids);
    } catch (err) {
      console.error('failed to unproject', sourceId, err);
    }
    const newRemoteTrackSources = new Map(remoteTrackSourcesRef.current);
    newRemoteTrackSources.delete(sourceId);
    setRemoteTrackSources(newRemoteTrackSources);
  };

  const projectRemoteTrackToMain = async (sourceId: SourceId) => {
    if (!millicastView.current) return;
    const remoteTrackSource = remoteTrackSourcesRef.current.get(sourceId);
    if (!remoteTrackSource) return;
    const mapping = [];
    if (remoteTrackSource.videoMediaId) mapping.push({ mediaId: mainVideoMidRef.current, media: 'video' });
    if (remoteTrackSource.audioMediaId) mapping.push({ mediaId: mainAudioMidRef.current, media: 'audio' });
    try {
      await millicastView.current.project(sourceId === mainSourceIdRef.current ? undefined : sourceId, mapping);
    } catch (err) {
      handleError(err);
    }
  };

  return {
    viewerState,
    mainStream,
    setupViewer,
    stopViewer,
    startViewer,
    projectRemoteTrackToMain,
    remoteTrackSources,
    viewerCount,
    streamQualityOptions,
    updateStreamQuality,
    statistics,
  };
};

export default useViewer;
