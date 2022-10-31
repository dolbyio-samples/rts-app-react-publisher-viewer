import { useEffect, useRef, useState } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { Director, View, Logger } from '@millicast/sdk';
import type { MediaStreamSource, ViewOptions, BroadcastEvent } from '@millicast/sdk';

/**
 * TODO: add more state for differernt sources
 * ready: initial state
 * connecting: connecting to millicast backend
 * connected: connected to millicast backend
 * active: live stream is broadcasting
 * inactive: live stream is not broadcasting, but still available
 * stopped: live stream is off, no longer available
 */
export type ViewerState = 'ready' | 'connecting' | 'connected';

export type Viewer = {
  viewerState: ViewerState;
  setupViewer: (streamName: string, streamAccountId: string, subscriberToken?: string) => void;
  connect: (options?: ViewOptions) => void;
  project: (sourceId: string) => void;
  viewerStreams: MediaStream[];
  viewerMediaSources: MediaStreamSource[];
};

const useViewer = (): Viewer => {
  const [viewerState, setViewerState] = useState<ViewerState>('ready');
  const [viewerStreams, setViewerStreams] = useState<MediaStream[]>([]);
  const [viewerMediaSources, setViewerMediaSources] = useState<MediaStreamSource[]>([]);
  const millicastView = useRef<View>();
  const handleError = useErrorHandler();

  useEffect(() => {
    Logger.setLevel(Logger.DEBUG);
  }, []);

  const setupViewer = (streamName: string, streamAccountId: string, subscriberToken?: string) => {
    console.log('setup view');
    millicastView.current?.stop();
    const tokenGenerator = () =>
      Director.getSubscriber({ streamName, streamAccountId, subscriberToken });
    millicastView.current = new View(streamName, tokenGenerator);
    millicastView.current.on('track', (event: RTCTrackEvent) => {
      console.log('get a new track', event.streams);
      setViewerStreams([...viewerStreams, ...event.streams]);
    });
    millicastView.current.on('broadcastEvent', (event: BroadcastEvent) => {
      console.log('get event', event.name, event.data);
      switch (event.name) {
        case 'active':
          {
            const source = event.data as MediaStreamSource;
            if (viewerMediaSources.some((src) => src.sourceId === source.sourceId)) return;
            setViewerMediaSources([...viewerMediaSources, source]);
          }
          break;
        case 'inactive':
          {
            // TODO: remove the source from media sources and project another one if available
            const source = event.data as MediaStreamSource;
            const newSources = viewerMediaSources.filter((src) => {
              src.sourceId !== source.sourceId;
            });
            setViewerMediaSources(newSources);
          }
          break;
        case 'stopped':
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
    const sources = viewerMediaSources.filter((src) => {
      return src.sourceId === sourceId;
    });
    console.log('find source', sources, millicastView.current?.isActive()); // why it's not active here??
    if (millicastView.current && sources.length) {
      millicastView.current.project(
        sourceId,
        sources[0].tracks.map((track) => {
          return { trackId: track.trackId };
        })
      );
      // console.log(Logger.getHistory());
    }
  };

  return {
    viewerState,
    setupViewer,
    connect,
    project,
    viewerStreams,
    viewerMediaSources,
  };
};

export default useViewer;
