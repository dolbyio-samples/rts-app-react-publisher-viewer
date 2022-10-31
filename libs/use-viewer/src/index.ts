import { useRef, useState } from 'react';

import { Director, View } from '@millicast/sdk';

export type ViewerState = 'ready' | 'connecting' | 'subscribed';

export type Viewer = {
  viewerState: ViewerState;
  setupViewer: (streamName: string, streamAccountId: string, subscriberToken?: string) => void;
  viewerStreams: MediaStream[];
};

const useViewer = (): Viewer => {
  const [viewerState, setViewerState] = useState<ViewerState>('ready');
  const [viewerStreams, setViewerStreams] = useState<MediaStream[]>([]);
  const millicastView = useRef<View>();

  const setupViewer = (streamName: string, streamAccountId: string, subscriberToken?: string) => {
    millicastView.current?.stop();
    const tokenGenerator = () =>
      Director.getSubscriber({ streamName, streamAccountId, subscriberToken });
    millicastView.current = new View(streamName, tokenGenerator);
    millicastView.current.on('track', (event: RTCTrackEvent) => {
      setViewerStreams([...viewerStreams, ...event.streams]);
    });
  };

  return {
    viewerState,
    setupViewer,
    viewerStreams,
  };
};

export default useViewer;
