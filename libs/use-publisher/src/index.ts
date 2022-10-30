import { useEffect, useRef, useState } from 'react';
import { Director, Publish, PeerConnection, BroadcastOptions } from '@millicast/sdk';

import type { streamStats } from '@millicast/sdk';

export type PublisherState = 'ready' | 'connecting' | 'streaming';

export type DisplayStreamingOptions = Pick<BroadcastOptions, 'mediaStream' | 'sourceId'>;

// TODO: refactor to support multi-sources, treat presenter stream, display stream as sources and manage them in a map
// presenter stream should be the main stream, other source streams will depend on it.
export interface Publisher {
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
  statistics?: streamStats;
}

const usePublisher = (token: string, streamName: string, streamId: string): Publisher => {
  const [publisherState, setPublisherState] = useState<PublisherState>('ready');
  const [viewerCount, setViewerCount] = useState(0);
  const [statistics, setStatistics] = useState<streamStats>();

  const [codec, setCodec] = useState<string>('');
  const [codecList, setCodecList] = useState<string[]>([]);

  const publisher = useRef<Publish>();
  const displayPublisher = useRef<Publish>();

  useEffect(() => {
    if (!token || !streamName) return;
    const tokenGenerator = () => Director.getPublisher({ token: token, streamName: streamName });
    publisher.current = new Publish(streamName, tokenGenerator, true);
    displayPublisher.current = new Publish(streamName, tokenGenerator, true);
    return () => {
      stopDisplayStreaming();
      stopStreaming();
    };
  }, [token, streamName]);

  useEffect(() => {
    const capabilities = PeerConnection.getCapabilities('video');
    const supportedCodecs = capabilities.codecs
      .filter((item) => item.codec.toLowerCase() !== 'av1')
      .map((item) => item.codec);
    if (supportedCodecs.length === 0) return;
    setCodecList(supportedCodecs);
    setCodec(supportedCodecs[0]);
  }, []);

  const startStreaming = async (options: BroadcastOptions) => {
    if (!publisher.current || publisher.current.isActive() || publisherState !== 'ready') return;
    try {
      setPublisherState('connecting');
      await publisher.current.connect(options);

      publisher.current.on('broadcastEvent', (event) => {
        const { name, data } = event;
        if (options.events?.includes(name)) setViewerCount(data.viewercount);
      });
      setPublisherState('streaming');
      publisher.current.webRTCPeer.initStats();

      publisher.current.webRTCPeer.on('stats', (statistics) => {
        setStatistics(statistics);
      });
    } catch (e) {
      setPublisherState('ready');
      console.error(e);
    }
  };

  const stopStreaming = async () => {
    publisher.current?.stop();
    setPublisherState('ready');
    setStatistics(undefined);
  };

  const updateStreaming = (stream: MediaStream) => {
    if (publisher.current && publisher.current.isActive()) {
      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length) {
        publisher.current.webRTCPeer.replaceTrack(audioTracks[0]);
      }
      const videoTracks = stream.getVideoTracks();
      if (videoTracks.length) {
        publisher.current.webRTCPeer.replaceTrack(videoTracks[0]);
      }
    }
  };

  const updateCodec = (codecValue: string) => {
    if (publisherState !== 'ready' && codecList != undefined && !codecList.includes(codecValue))
      return;
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

  const linkText = `https://viewer.millicast.com/?streamId=${streamId}/${streamName}`;

  return {
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
