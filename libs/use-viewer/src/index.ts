import { useRef, useState } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { BroadcastEvent, Director, View, ViewOptions } from '@millicast/sdk';
import type { MediaStreamSource } from '@millicast/sdk';

/**
 * ready: initial state
 * connecting: connecting to millicast backend
 * connected: connected to millicast backend
 * active: live stream is broadcasting
 * inactive: live stream is not broadcasting, but still available
 * stopped: live stream is off, no longer available
 */
export type ViewerState = 'ready' | 'connecting' | 'connected' | 'active' | 'inactive' | 'stopped';

export type Viewer = {
  viewerState: ViewerState;
  setupViewer: (streamName: string, streamAccountId: string, subscriberToken?: string) => void;
  connect: (options?: ViewOptions) => void;
  viewerStreams: MediaStream[];
  viewerMediaSources?: MediaStreamSource[];
  projectingSourceId?: string;
};

const useViewer = (): Viewer => {
  const [viewerState, setViewerState] = useState<ViewerState>('ready');
  const [viewerStreams, setViewerStreams] = useState<MediaStream[]>([]);
  const [viewerMediaSources, setViewerMediaSources] = useState<MediaStreamSource[]>([]);
  const [projectingSourceId, setProjectingSourceId] = useState<string>();
  const millicastView = useRef<View>();
  const handleError = useErrorHandler();

  const setupViewer = (streamName: string, streamAccountId: string, subscriberToken?: string) => {
    console.log('setup view');
    millicastView.current?.stop();
    const tokenGenerator = () =>
      Director.getSubscriber({ streamName, streamAccountId, subscriberToken });
    millicastView.current = new View(streamName, tokenGenerator);
    millicastView.current.on('track', (event: RTCTrackEvent) => {
      console.log('get a new track', event.streams);
      setViewerStreams([...viewerStreams, ...event.streams]);
      if (!projectingSourceId && millicastView.current && viewerMediaSources.length) {
        millicastView.current.project({
          sourceId: viewerMediaSources[0].sourceId,
          mapping: viewerMediaSources[0].tracks.map((track) => {
            return { trackId: track.trackId, mediaId: track.media };
          }),
        });
        setProjectingSourceId(viewerMediaSources[0].sourceId);
      }
    });
    millicastView.current.on('broadcastEvent', (event: BroadcastEvent) => {
      console.log('get event', event.name, event.data);
      switch (event.name) {
        case 'active':
          {
            const source = event.data as MediaStreamSource;
            if (viewerMediaSources.some((src) => src.sourceId === source.sourceId)) return;
            setViewerMediaSources([...viewerMediaSources, source]);
            setViewerState('active');
          }
          break;
        case 'inactive':
          // TODO: remove the source from media sources and project another one if available
          setViewerState('inactive');
          break;
        case 'stopped':
          setViewerState('stopped');
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

  return {
    viewerState,
    setupViewer,
    connect,
    viewerStreams,
    viewerMediaSources,
    projectingSourceId,
  };
};

export default useViewer;
