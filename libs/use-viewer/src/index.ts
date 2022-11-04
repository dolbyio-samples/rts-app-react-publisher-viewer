import { useRef } from 'react';
import useState from 'react-usestateref';
import { useErrorHandler } from 'react-error-boundary';
import { Director, LayerInfo, MediaLayer, MediaStreamLayers, MediaTrackInfo, View, ViewerCount } from '@millicast/sdk';
import { MediaStreamSource, ViewOptions, BroadcastEvent } from '@millicast/sdk';

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
  setupViewer: (streamName: string, streamAccountId: string, subscriberToken?: string) => void;
  stopViewer: () => void;
  startViewer: (options?: ViewOptions) => void;
  remoteTrackSources: Map<SourceId, RemoteTrackSource>;
  viewerCount: number;
  streamQualityOptions: SimulcastQuality[];
  updateStreamQuality: (selectedQuality: StreamQuality) => void;
};

const useViewer = (): Viewer => {
  const [viewerState, setViewerState] = useState<ViewerState>('initial');
  const [remoteTrackSources, setRemoteTrackSources, remoteTrackSourcesRef] = useState<Map<SourceId, RemoteTrackSource>>(
    new Map()
  );
  const [mainStream, setMainStream] = useState<MediaStream>();
  const millicastView = useRef<View>();
  const sourceIds = useRef<Set<string>>(new Set());
  const [viewerCount, setViewerCount] = useState<number>(0);
  const handleError = useErrorHandler();

  const streamQuality = useRef<StreamQuality>();
  const [streamQualityOptions, setStreamQualityOptions] = useState<SimulcastQuality[]>([{ streamQuality: 'Auto' }]);

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
          spatialLayerId: layer.layers[0].spatialLayerId,
          temporalLayerId: layer.layers[0].temporalLayerId,
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

  const setupViewer = (streamName: string, streamAccountId: string, subscriberToken?: string) => {
    millicastView.current?.stop();
    const tokenGenerator = () => Director.getSubscriber({ streamName, streamAccountId, subscriberToken });
    millicastView.current = new View(streamName, tokenGenerator);
    millicastView.current.on('track', (event: RTCTrackEvent) => {
      if (event.streams.length === 0) return; // other sources
      setMainStream(event.streams[0]);
    });
    millicastView.current.on('broadcastEvent', (event: BroadcastEvent) => {
      switch (event.name) {
        case 'active':
          {
            const source = event.data as MediaStreamSource;
            if (!source.sourceId) {
              // main stream
              setViewerState('liveOn');
              return;
            }
            sourceIds.current.add(source.sourceId);
            addRemoteVideoTrackAndProject(source.sourceId, source.tracks);
          }
          break;
        case 'inactive':
          {
            const source = event.data as MediaStreamSource;
            if (!source.sourceId) {
              // main stream
              setViewerState('liveOff');
              return;
            }
            const sourceId = source.sourceId;
            sourceIds.current.delete(sourceId);
            unprojectAndRemoveRemoteTrack(sourceId);
          }
          break;
        case 'viewercount':
          setViewerCount((event.data as ViewerCount).viewercount);
          break;
        case 'stopped':
          // TODO: what data can we get from this event? should we call setViewerStreams([]) ?
          console.log('stopped', event.data);
          break;
        case 'layers': {
          const layers = (event.data as MediaStreamLayers).medias['0']?.active;
          if (!layers || layers.length == 0) return;
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
    if (millicastView.current && millicastView.current.isActive()) return;
    try {
      setViewerState('connecting');
      await millicastView.current.connect(options);
      // TODO remove
      millicastView.current.webRTCPeer.initStats()
      millicastView.current.webRTCPeer.on('stats', (stats) => {
        // console.log('Stats from event: ', stats.video.inbounds);
      });
      // END TODO
    } catch (error) {
      handleError(error);
    }
  };

  const addRemoteVideoTrackAndProject = async (sourceId: string, trackInfos: MediaTrackInfo[]) => {
    if (!millicastView.current) return;
    let videoTransceiver: RTCRtpTransceiver | undefined;
    let audioTransceiver: RTCRtpTransceiver | undefined;
    const mediaStream = new MediaStream();
    const mapping = [];
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
        mapping.push({ trackId: 'audio', mediaId: audioMid, media: 'audio' });
        trackSource.audioMediaId = audioMid;
      }
    }
    if (mapping.length === 0) {
      handleError('No valid video or audio track');
      return;
    }
    try {
      await millicastView.current.project(sourceId, mapping);
    } catch (err) {
      handleError(err);
    }
    const newRemoteTrackSources = new Map(remoteTrackSourcesRef.current);
    newRemoteTrackSources.set(sourceId, trackSource);
    setRemoteTrackSources(newRemoteTrackSources);
  };

  const unprojectAndRemoveRemoteTrack = async (sourceId: string) => {
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
      handleError(err);
    }
    const newRemoteTrackSources = new Map(remoteTrackSourcesRef.current);
    newRemoteTrackSources.delete(sourceId);
    setRemoteTrackSources(newRemoteTrackSources);
  };

  const stopViewer = () => {
    millicastView.current?.stop();
  };

  return {
    viewerState,
    mainStream,
    setupViewer,
    stopViewer,
    startViewer,
    remoteTrackSources,
    viewerCount,
    streamQualityOptions,
    updateStreamQuality,
  };
};

export default useViewer;
