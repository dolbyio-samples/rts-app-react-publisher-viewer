import { useCallback, useEffect, useRef } from 'react';
import useState from 'react-usestateref';
import {
  Director,
  Publish,
  PeerConnection,
  BroadcastOptions,
  BroadcastEvent,
  ViewerCount,
  Capabilities,
} from '@millicast/sdk';

import type { StreamStats } from '@millicast/sdk';

export type PublisherState = 'initial' | 'ready' | 'connecting' | 'streaming';

export type DisplayStreamingOptions = Pick<BroadcastOptions, 'mediaStream' | 'sourceId'>;
export interface Bitrate {
  name: string;
  value: number;
}

// TODO: refactor to support multi-sources, treat presenter stream, display stream as sources and manage them in a map
// presenter stream should be the main stream, other source streams will depend on it.
export interface Publisher {
  setupPublisher: (token: string, streamName: string, streamId: string, viewerAppBaseUrl?: string) => void;
  startStreaming: (options: BroadcastOptions) => Promise<void>;
  stopStreaming: () => void;
  updateStreaming: (mediaStream: MediaStream) => void;
  codecList: string[];
  bitrateList: Bitrate[];
  updateBitrate: (bitrate: number) => Promise<void>;
  startDisplayStreaming: (options: DisplayStreamingOptions) => void;
  stopDisplayStreaming: () => void;
  publisherState: PublisherState;
  viewerCount: number;
  linkText?: string;
  statistics?: StreamStats;
}

type UsePublisherArguments = {
  handleError?: (error: string) => void;
};

const usePublisher = ({ handleError }: UsePublisherArguments): Publisher => {
  const [publisherState, setPublisherState] = useState<PublisherState>('initial');
  const [viewerCount, setViewerCount] = useState(0);
  const [statistics, setStatistics] = useState<StreamStats>();
  const [codecList, setCodecList] = useState<string[]>([]);
  const publisher = useRef<Publish>();
  const displayPublisher = useRef<Publish>();
  const [linkText, setLinkText] = useState<string>();

  const _handleError = (error: unknown) => {
    if (error instanceof Error) {
      handleError?.(error.message);
    } else {
      handleError?.(`${error}`);
    }
  };

  useEffect(() => {
    let capabilities: Capabilities;
    try {
      capabilities = PeerConnection.getCapabilities('video');
    } catch (error: unknown) {
      _handleError(error);
      return;
    }
    const supportedCodecs = capabilities?.codecs
      .filter((item) => item.codec.toLowerCase() !== 'av1')
      .sort((item) => {
        return item.codec.toLowerCase() === 'h264' ? -1 : 1;
      })
      .map((item) => item.codec);

    if (!supportedCodecs || supportedCodecs.length === 0) return;
    setCodecList(supportedCodecs);
    return () => {
      publisher.current?.removeAllListeners();
    };
  }, []);

  const broadcastEventHandler = useCallback((event: BroadcastEvent) => {
    if (event.name === 'viewercount') setViewerCount((event.data as ViewerCount).viewercount);
  }, []);

  const setupPublisher = (token: string, streamName: string, streamId: string, viewerAppBaseUrl?: string) => {
    if (displayPublisher.current && displayPublisher.current.isActive()) stopDisplayStreaming();
    if (publisher.current && publisher.current.isActive()) stopStreaming();
    try {
      const tokenGenerator = () => Director.getPublisher({ token: token, streamName: streamName });
      publisher.current = new Publish(streamName, tokenGenerator, true);
      displayPublisher.current = new Publish(streamName, tokenGenerator, true);
    } catch (error: unknown) {
      _handleError(error);
      return;
    }
    if (viewerAppBaseUrl) setLinkText(`${viewerAppBaseUrl}?streamAccountId=${streamId}&streamName=${streamName}`);
    publisher.current.on('broadcastEvent', broadcastEventHandler);
    setPublisherState('ready');
  };

  const statisticsEventHandler = useCallback((statistics: StreamStats) => {
    setStatistics(statistics);
  }, []);

  useEffect(() => {
    switch (publisherState) {
      case 'streaming':
        {
          publisher.current?.webRTCPeer?.initStats();
          publisher.current?.webRTCPeer?.addListener('stats', statisticsEventHandler);
        }
        break;
      case 'ready':
        {
          publisher.current?.webRTCPeer?.removeListener('stats', statisticsEventHandler);
          publisher.current?.webRTCPeer?.stopStats();
        }
        break;
      default:
        break;
    }
  }, [publisherState]);

  const startStreaming = async (options: BroadcastOptions): Promise<void> => {
    if (!publisher.current || publisherState !== 'ready') return Promise.reject('Please set up publisher first');
    if (publisher.current.isActive()) return Promise.reject('Publihser is connected already');
    try {
      setPublisherState('connecting');
      await publisher.current.connect(options);
      setPublisherState('streaming');
      return Promise.resolve();
    } catch (error: unknown) {
      setPublisherState('ready');
      return Promise.reject(error);
    }
  };

  const stopStreaming = async () => {
    publisher.current?.stop();
    setPublisherState('ready');
    setStatistics(undefined);
  };

  const updateStreaming = (stream: MediaStream) => {
    if (!publisher.current || !publisher.current.isActive()) return;
    try {
      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length) {
        publisher.current.webRTCPeer?.replaceTrack(audioTracks[0]);
      }
      const videoTracks = stream.getVideoTracks();
      if (videoTracks.length) {
        publisher.current.webRTCPeer?.replaceTrack(videoTracks[0]);
      }
    } catch (error: unknown) {
      _handleError(error);
    }
  };

  const startDisplayStreaming = async (options: DisplayStreamingOptions) => {
    if (!displayPublisher.current || displayPublisher.current.isActive()) return;
    try {
      await displayPublisher.current.connect(options);
    } catch (error: unknown) {
      _handleError(error);
    }
  };

  const stopDisplayStreaming = () => {
    displayPublisher.current?.stop();
  };

  const updateBitrate = async (bitrate: number): Promise<void> => {
    if (!publisher.current || !publisher.current.isActive() || !publisher.current.webRTCPeer) {
      return Promise.reject('Publisher is not connected');
    }

    if (!bitrateList.some((bitrateItem) => bitrateItem.value === bitrate)) {
      return Promise.reject(`Invalid bitrate: ${bitrate}`);
    }
    return publisher.current.webRTCPeer.updateBitrate(bitrate);
  };

  const bitrateList: Bitrate[] = [
    { name: 'Auto', value: 0 },
    { name: '2 Mbps', value: 2_000 },
    { name: '1 Mbps', value: 1_000 },
    { name: '500 Kbps', value: 500 },
    { name: '250 Kbps', value: 250 },
  ];

  return {
    setupPublisher,
    startStreaming,
    stopStreaming,
    updateStreaming,
    codecList,
    bitrateList,
    updateBitrate,
    startDisplayStreaming,
    stopDisplayStreaming,
    publisherState,
    viewerCount,
    linkText,
    statistics: statistics,
  };
};

export default usePublisher;
