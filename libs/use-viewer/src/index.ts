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
  mainSourceId: string;
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
  const mainSourceId = 'Main';

  const streamQuality = useRef<StreamQuality>();
  const [streamQualityOptions, setStreamQualityOptions] = useState<SimulcastQuality[]>([{ streamQuality: 'Auto' }]);

  const constructLayers = (layers: MediaLayer[]) => {
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
    if (!millicastView.current) throw 'Please set up Viewer first';
    if (millicastView.current && millicastView.current.isActive()) return;
    try {
      setViewerState('connecting');
      await millicastView.current.connect(options);
      // TODO remove
      millicastView.current.webRTCPeer.initStats();
      millicastView.current.webRTCPeer.on('stats', (stats) => {
        // console.log('Stats from event: ', stats.video.inbounds);
      });
      // END TODO
    } catch (error) {
      // TODO: try reconnect
      setViewerState('ready');
      handleError(error);
    }
  };

  const addRemoteVideoTrackAndProject = async (sourceId: string, trackInfos: MediaTrackInfo[]) => {
    if (!millicastView.current) return;
    let videoTransceiver: RTCRtpTransceiver | undefined;
    let audioTransceiver: RTCRtpTransceiver | undefined;
    const mediaStream = new MediaStream();
    if (trackInfos.some((info) => info.media == 'video'))
      videoTransceiver = await millicastView.current.addRemoteTrack('video', [mediaStream]);
    if (trackInfos.some((info) => info.media == 'audio'))
      audioTransceiver = await millicastView.current.addRemoteTrack('audio', [mediaStream]);
    const videoMid = videoTransceiver?.mid ?? undefined;
    const audioMid = audioTransceiver?.mid ?? undefined;
    if (!videoMid && !audioMid) throw 'No valid video or video in remote track';
    const newRemoteTrackSources = new Map(remoteTrackSourcesRef.current);
    newRemoteTrackSources.set(sourceId, { mediaStream, videoMediaId: videoMid, audioMediaId: videoMid });
    setRemoteTrackSources(newRemoteTrackSources);
    const mapping = [];
    if (videoMid) mapping.push({ trackId: 'video', mediaId: videoMid, media: 'video' });
    if (audioMid) mapping.push({ trackId: 'audio', mediaId: audioMid, media: 'audio' });
    try {
      await millicastView.current.project(sourceId, mapping);
    } catch (error) {
      setViewerState('ready');
      handleError(error);
    }
  };

  const unprojectAndRemoveRemoteTrack = async (sourceId: string) => {
    if (!millicastView.current) return;
    const remoteTrackSource = remoteTrackSourcesRef.current.get(sourceId);
    if (!remoteTrackSource) return;
    const mids = [];
    if (remoteTrackSource.videoMediaId) mids.push(remoteTrackSource.videoMediaId);
    if (remoteTrackSource.audioMediaId) mids.push(remoteTrackSource.audioMediaId);
    if (mids.length === 0) return;
    await millicastView.current.unproject(mids);
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
    mainSourceId,
    viewerCount,
    streamQualityOptions,
    updateStreamQuality,
  };
};

export default useViewer;
