import { useEffect, useRef } from 'react';
import useState from 'react-usestateref';
import { useErrorHandler } from 'react-error-boundary';
import { Director, View } from '@millicast/sdk';
import { MediaStreamSource, ViewOptions, BroadcastEvent, Logger } from '@millicast/sdk';

/**
 * TODO: add more state for differernt sources
 * ready: initial state
 * connecting: connecting to millicast backend
 * connected: connected to millicast backend
 *
 * Below states should apply to current stream and depends on if it's multi-sources
 * active: live stream is broadcasting, or a new source is actived
 * inactive: live stream is not broadcasting, but still available; or a source is inactived
 * stopped: live stream is off, no longer available
 */
export type ViewerState = 'ready' | 'connecting' | 'connected';

export type Viewer = {
  viewerState: ViewerState;
  setupViewer: (streamName: string, streamAccountId: string, subscriberToken?: string) => void;
  stop: () => void;
  connect: (options?: ViewOptions) => void;
  project: (sourceId: string) => void;
  viewerStreams: MediaStream[];
  // This is for mulit-source broadcast
  // TODO: handle single source broadcast
  viewerMediaSources: MediaStreamSource[];
};

const useViewer = (): Viewer => {
  const [viewerState, setViewerState] = useState<ViewerState>('ready');
  const [viewerStreams, setViewerStreams, viewStreamsRef] = useState<MediaStream[]>([]);
  const [viewerMediaSources, setViewerMediaSources, viewerMediaSourcesRef] = useState<MediaStreamSource[]>([]);
  const millicastView = useRef<View>();
  const handleError = useErrorHandler();

  // useEffect(() => {
  //   Logger.setLevel(Logger.DEBUG);
  // }, []);

  const setupViewer = (streamName: string, streamAccountId: string, subscriberToken?: string) => {
    millicastView.current?.stop();
    const tokenGenerator = () => Director.getSubscriber({ streamName, streamAccountId, subscriberToken });
    millicastView.current = new View(streamName, tokenGenerator);
    millicastView.current.on('track', (event: RTCTrackEvent) => {
      setViewerStreams([...viewStreamsRef.current, ...event.streams]);
    });
    millicastView.current.on('broadcastEvent', (event: BroadcastEvent) => {
      switch (event.name) {
        case 'active':
          {
            const source = event.data as MediaStreamSource;
            if (
              viewerMediaSourcesRef.current.some((src) => {
                return src.sourceId === source.sourceId;
              })
            ) {
              return;
            }
            setViewerMediaSources([source, ...viewerMediaSourcesRef.current]);
          }
          break;
        case 'inactive':
          {
            const source = event.data as MediaStreamSource;
            const newSources = viewerMediaSourcesRef.current.filter((src) => {
              return src.sourceId !== source.sourceId;
            });
            setViewerMediaSources(newSources);
          }
          break;
        case 'stopped':
          // TODO: what data can we get from this event? should we call setViewerStreams([]) ?
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

  const project = async (sourceId: string) => {
    const sources = viewerMediaSourcesRef.current.filter((src) => {
      return src.sourceId === sourceId;
    });
    if (millicastView.current && sources.length) {
      millicastView.current.project(
        sources[0].sourceId,
        // TODO: add more mapping properties
        sources[0].tracks.map((track) => {
          return { trackId: track.trackId };
        })
      );
    }
  };

  const stop = () => {
    millicastView.current?.stop();
  };

  return {
    viewerState,
    setupViewer,
    stop,
    connect,
    project,
    viewerStreams,
    viewerMediaSources,
  };
};

export default useViewer;
