import { useEffect, useRef, useState } from 'react';
import { Director, Publish, PeerConnection, BroadcastOptions, BroadcastEvent, ViewerCount } from '@millicast/sdk';

import type { StreamStats } from '@millicast/sdk';

export type PublisherState = 'initial' | 'ready' | 'connecting' | 'streaming';

export type DisplayStreamingOptions = Pick<BroadcastOptions, 'mediaStream' | 'sourceId'>;

// TODO: refactor to support multi-sources, treat presenter stream, display stream as sources and manage them in a map
// presenter stream should be the main stream, other source streams will depend on it.
export interface Publisher {
  setupPublisher: (token: string, streamName: string, streamId: string) => void;
  startStreaming: (options: BroadcastOptions) => void;
  stopStreaming: () => void;
  updateStreaming: (mediaStream: MediaStream) => void;
  codec: string;
  codecList: string[];
  updateCodec: (codec: string) => void;
  startDisplayStreaming: (options: DisplayStreamingOptions) => void;
  stopDisplayStreaming: () => void;
  publisherState: PublisherState;
  viewerCount: number;
  linkText: string;
  statistics?: StreamStats;
}

const usePublisher = (): Publisher => {
  const [publisherState, setPublisherState] = useState<PublisherState>('initial');
  const [viewerCount, setViewerCount] = useState(0);
  const [statistics, setStatistics] = useState<StreamStats>();

  const [codec, setCodec] = useState<string>('');
  const [codecList, setCodecList] = useState<string[]>([]);

  const publisher = useRef<Publish>();
  const displayPublisher = useRef<Publish>();

  const [linkText, setLinkText] = useState<string>('https://viewer.millicast.com/?streamId=/');

  useEffect(() => {
    const capabilities = PeerConnection.getCapabilities('video');
    const supportedCodecs = capabilities.codecs
      .filter((item) => item.codec.toLowerCase() !== 'av1')
      .sort((item) => {
        return item.codec.toLowerCase() === 'h264' ? -1 : 1;
      })
      .map((item) => item.codec);

    if (supportedCodecs.length === 0) return;
    setCodec(supportedCodecs[0]);
    setCodecList(supportedCodecs);
  }, []);

  const setupPublisher = (token: string, streamName: string, streamId: string) => {
    if (displayPublisher.current && displayPublisher.current.isActive()) stopDisplayStreaming();
    if (publisher.current && publisher.current.isActive()) stopStreaming();
    const tokenGenerator = () => Director.getPublisher({ token: token, streamName: streamName });
    publisher.current = new Publish(streamName, tokenGenerator, true);
    displayPublisher.current = new Publish(streamName, tokenGenerator, true);
    setLinkText(`https://viewer.millicast.com/?streamId=${streamId}/${streamName}`);
    publisher.current.on('broadcastEvent', (event: BroadcastEvent) => {
      if (event.name === 'viewercount') setViewerCount((event.data as ViewerCount).viewercount);
    });
    setPublisherState('ready');
  };

  const startStreaming = async (options: BroadcastOptions) => {
    if (!publisher.current || publisher.current.isActive() || publisherState !== 'ready') return;
    try {
      //TODO: refine the state by broadcastEvent
      setPublisherState('connecting');
      await publisher.current.connect(options);
      setPublisherState('streaming');
      publisher.current.webRTCPeer?.initStats();
      publisher.current.webRTCPeer?.on('stats', (statistics) => {
        setStatistics(statistics);
      });
    } catch (e) {
      setPublisherState('ready');
      console.error(e);
    }
  };

  const stopStreaming = async () => {
    publisher.current?.webRTCPeer?.stopStats();
    publisher.current?.stop();
    setPublisherState('ready');
    setStatistics(undefined);
  };

  const updateStreaming = (stream: MediaStream) => {
    if (publisher.current && publisher.current.isActive()) {
      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length) {
        publisher.current.webRTCPeer?.replaceTrack(audioTracks[0]);
      }
      const videoTracks = stream.getVideoTracks();
      if (videoTracks.length) {
        publisher.current.webRTCPeer?.replaceTrack(videoTracks[0]);
      }
    }
  };

  const updateCodec = (codecValue: string) => {
    if (publisherState !== 'ready' && codecList != undefined && !codecList.includes(codecValue)) return;
    setCodec(codecValue);
  };

  const startDisplayStreaming = async (options: DisplayStreamingOptions) => {
    if (!displayPublisher.current || displayPublisher.current.isActive()) return;
    try {
      await displayPublisher.current.connect(options);
    } catch (error) {
      console.error(error);
    }
  };

  const stopDisplayStreaming = () => {
    displayPublisher.current?.stop();
  };

  return {
    setupPublisher,
    startStreaming,
    stopStreaming,
    updateStreaming,
    codec,
    codecList,
    updateCodec,
    startDisplayStreaming,
    stopDisplayStreaming,
    publisherState,
    viewerCount,
    linkText,
    statistics: statistics,
  };
};

export default usePublisher;
