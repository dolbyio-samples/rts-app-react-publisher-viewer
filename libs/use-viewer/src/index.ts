import { useRef, useEffect } from 'react';
import useState from 'react-usestateref';
import { useErrorHandler } from 'react-error-boundary';
import { Director, View } from '@millicast/sdk';
import { MediaStreamSource, ViewOptions, BroadcastEvent, Logger } from '@millicast/sdk';

export type ViewerState = 'ready' | 'connecting' | 'connected';

export type RemoteTrackSource = {
  mediaStream: MediaStream;
  videoMediaId?: string;
  audioMediaId?: string;
};

type SourceId = string;

export type Viewer = {
  viewerState: ViewerState;
  setupViewer: (streamName: string, streamAccountId: string, subscriberToken?: string) => void;
  stopViewer: () => void;
  connect: (options?: ViewOptions) => void;
  remoteTrackSources: Map<SourceId, RemoteTrackSource>;
  mainSourceId: string;
};

const useViewer = (): Viewer => {
  const [viewerState, setViewerState] = useState<ViewerState>('ready');
  const [remoteTrackSources, setRemoteTrackSources, remoteTrackSourcesRef] = useState<Map<SourceId, RemoteTrackSource>>(
    new Map()
  );
  const millicastView = useRef<View>();
  const sourceIds = useRef<Set<string>>(new Set());
  const handleError = useErrorHandler();
  const mainSourceId = 'Main';

  useEffect(() => {
    // Logger.setLevel(Logger.DEBUG);
  }, []);

  const setupViewer = (streamName: string, streamAccountId: string, subscriberToken?: string) => {
    millicastView.current?.stop();
    const tokenGenerator = () => Director.getSubscriber({ streamName, streamAccountId, subscriberToken });
    millicastView.current = new View(streamName, tokenGenerator);
    millicastView.current.on('broadcastEvent', (event: BroadcastEvent) => {
      switch (event.name) {
        case 'active':
          {
            const source = event.data as MediaStreamSource;
            console.log('active source', source);
            const sourceId = source.sourceId || mainSourceId;
            sourceIds.current.add(sourceId);
            addRemoteVideoTrackAndProject(source.sourceId);
          }
          break;
        case 'inactive':
          {
            const source = event.data as MediaStreamSource;
            const sourceId = source.sourceId || mainSourceId;
            console.log('inactive', sourceId);
            sourceIds.current.delete(sourceId);
            unprojectAndRemoveRemoteTrack(sourceId);
          }
          break;
        case 'stopped':
          // TODO: what data can we get from this event? should we call setViewerStreams([]) ?
          console.log('stopped', event.data);
          break;
        case 'layers':
          console.log('video layers', event.data);
          break;
      }
    });
  };

  const connect = async (options?: ViewOptions) => {
    if (!millicastView.current) throw 'Please set up Viewer first';
    if (millicastView.current && millicastView.current.isActive()) return;
    try {
      setViewerState('connecting');
      await millicastView.current.connect(options);
      setViewerState('connected');
    } catch (error) {
      // TODO: try reconnect
      setViewerState('ready');
      handleError(error);
    }
  };

  const addRemoteVideoTrackAndProject = async (sourceId: string) => {
    if (!millicastView.current) return;
    console.log('add remote video track and project');
    const mediaStream = new MediaStream();
    const videoTransceiver = await millicastView.current.addRemoteTrack('video', [mediaStream]);
    const audioTransceiver = await millicastView.current.addRemoteTrack('audio', [mediaStream]);
    const vmid = videoTransceiver.mid ?? undefined;
    const amid = audioTransceiver.mid ?? undefined;
    const newRemoteTrackSources = new Map(remoteTrackSourcesRef.current);
    newRemoteTrackSources.set(sourceId, { mediaStream, videoMediaId: vmid, audioMediaId: amid });
    setRemoteTrackSources(newRemoteTrackSources);
    try {
      await millicastView.current.project(sourceId, [
        {
          trackId: 'video',
          mediaId: vmid,
          media: 'video',
        },
        {
          trackId: 'audio',
          mediaId: amid,
          media: 'audio',
        },
      ]);
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
    setupViewer,
    stopViewer,
    connect,
    remoteTrackSources,
    mainSourceId,
  };
};

export default useViewer;
