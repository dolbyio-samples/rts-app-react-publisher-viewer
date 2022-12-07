import { useCallback, useEffect, useRef, useReducer, useState } from 'react';
import {
  BroadcastEvent,
  BroadcastOptions,
  Director,
  PeerConnection,
  Publish,
  StreamStats,
  VideoCodec,
  ViewerCount,
} from '@millicast/sdk';
import {
  Bitrate,
  Publisher,
  PublisherAction,
  PublisherActionType,
  PublisherProps,
  PublisherSource,
  PublisherSources,
  SourceId,
} from './types';

const reducer = (sources: PublisherSources, action: PublisherAction): PublisherSources => {
  switch (action.type) {
    case PublisherActionType.ADD_SOURCE: {
      if (sources.get(action.source.broadcastOptions.sourceId)) return sources;
      const newSources = new Map(sources) as PublisherSources;
      newSources.set(action.source.broadcastOptions.sourceId, action.source);
      return newSources;
    }
    case PublisherActionType.UPDATE_SOURCE_STATE: {
      const source = sources.get(action.sourceId);
      if (!source || source.state === action.state) return sources;
      const newSource = { ...source };
      newSource.state = action.state;
      const newSources = new Map(sources) as PublisherSources;
      newSources.set(action.sourceId, newSource);
      return newSources;
    }
    case PublisherActionType.UPDATE_SOURCE_STATISTICS: {
      const source = sources.get(action.sourceId);
      if (!source) return sources;
      const newSource = { ...source };
      newSource.statistics = action.statistics;
      const newSources = new Map(sources);
      newSources.set(action.sourceId, newSource);
      return newSources;
    }
    case PublisherActionType.UPDATE_SOURCE_BITRATE: {
      const source = sources.get(action.sourceId);
      if (!source) return sources;
      const newSource = { ...source };
      newSource.broadcastOptions.bandwidth = action.bitrate;
      const newSources = new Map(sources);
      return newSources;
    }
    case PublisherActionType.REMOVE_SOURCE: {
      const source = sources.get(action.sourceId);
      if (!source) return sources;
      const newSources = new Map(sources);
      newSources.delete(action.sourceId);
      return newSources;
    }
    default:
      return sources;
  }
};

const bitrateList: Bitrate[] = [
  { name: 'Auto', value: 0 },
  { name: '2 Mbps', value: 2_000 },
  { name: '1 Mbps', value: 1_000 },
  { name: '500 Kbps', value: 500 },
  { name: '250 Kbps', value: 250 },
];

const usePublisher = ({ token, streamName, streamId, viewerAppBaseUrl, handleError }: PublisherProps): Publisher => {
  const [viewerCount, setViewerCount] = useState(0);
  const viewerCountSourceIdRef = useRef<SourceId>();
  const [codecList, setCodecList] = useState<VideoCodec[]>([]);
  const [sources, dispatch] = useReducer(reducer, new Map() as PublisherSources);

  const handleInternalError = (error: unknown) => {
    if (error instanceof Error) {
      handleError?.(error.message);
    } else {
      handleError?.(`${error}`);
    }
  };

  const connectSource = async (source: PublisherSource) => {
    if (source.publish.isActive()) return;
    const sourceId = source.broadcastOptions.sourceId;
    try {
      dispatch({ type: PublisherActionType.UPDATE_SOURCE_STATE, sourceId, state: 'connecting' });
      await source.publish.connect(source.broadcastOptions);
      dispatch({ type: PublisherActionType.UPDATE_SOURCE_STATE, sourceId, state: 'streaming' });
      source.publish.webRTCPeer?.initStats();
      source.publish.webRTCPeer?.addListener('stats', (statistics: StreamStats) => {
        dispatch({ type: PublisherActionType.UPDATE_SOURCE_STATISTICS, sourceId: sourceId, statistics });
      });
      if (!viewerCountSourceIdRef.current) {
        viewerCountSourceIdRef.current = sourceId;
        source.publish.addListener('broadcastEvent', (event: BroadcastEvent) => {
          if (event.name === 'viewercount') setViewerCount((event.data as ViewerCount).viewercount);
        });
      }
    } catch (error: unknown) {
      dispatch({ type: PublisherActionType.REMOVE_SOURCE, sourceId });
      handleInternalError(error);
    }
  };

  const tokenGenerator = useCallback(
    () => Director.getPublisher({ token: token, streamName: streamName }),
    [token, streamName]
  );

  const shareUrl = viewerAppBaseUrl
    ? `${viewerAppBaseUrl}?streamAccountId=${streamId}&streamName=${streamName}`
    : undefined;

  useEffect(() => {
    const capabilities = PeerConnection.getCapabilities('video');
    const supportedCodecs = capabilities.codecs
      .filter((item) => item.codec.toLowerCase() !== 'av1')
      .sort((item) => {
        return item.codec.toLowerCase() === 'h264' ? -1 : 1;
      })
      .map((item) => item.codec);
    setCodecList(supportedCodecs);
    return () => {
      sources.forEach((source) => {
        stopStreamingSource(source.broadcastOptions.sourceId);
      });
    };
  }, []);

  const startStreamingSource = (broadcastOptions: BroadcastOptions) => {
    if (sources.get(broadcastOptions.sourceId)) return;
    const publish = new Publish(streamName, tokenGenerator, true);
    const newSource: PublisherSource = {
      publish,
      state: 'ready',
      broadcastOptions,
    };
    dispatch({ type: PublisherActionType.ADD_SOURCE, source: newSource });
    connectSource(newSource);
  };

  const stopStreamingSource = (sourceId: SourceId) => {
    const source = sources.get(sourceId);
    if (!source) return;
    source.publish.webRTCPeer?.stopStats();
    source.publish.webRTCPeer?.removeAllListeners('stats');
    source.publish.stop();
    if (viewerCountSourceIdRef.current && viewerCountSourceIdRef.current === sourceId) {
      source.publish.removeAllListeners('broadcastEvent');
      if (sources.size > 1) {
        const nextSourceId = Array.from(sources.keys()).find((key) => key !== sourceId);
        if (nextSourceId) {
          viewerCountSourceIdRef.current = nextSourceId;
          const nextSource = sources.get(nextSourceId);
          nextSource?.publish.addListener('broadcastEvent', (event: BroadcastEvent) => {
            if (event.name === 'viewercount') setViewerCount((event.data as ViewerCount).viewercount);
          });
        }
      } else {
        viewerCountSourceIdRef.current = undefined;
      }
    }
    dispatch({ type: PublisherActionType.REMOVE_SOURCE, sourceId });
  };

  const updateSourceMediaStream = (sourceId: string, mediaStream: MediaStream) => {
    const source = sources.get(sourceId);
    if (!source || !source.publish.isActive()) return;
    const audioTracks = mediaStream.getAudioTracks();
    if (audioTracks.length) {
      source.publish.webRTCPeer?.replaceTrack(audioTracks[0]);
    }
    const videoTracks = mediaStream.getVideoTracks();
    if (videoTracks.length) {
      source.publish.webRTCPeer?.replaceTrack(videoTracks[0]);
    }
  };

  const updateSourceBitrate = async (sourceId: string, bitrate: number) => {
    const source = sources.get(sourceId);
    if (!source || !source.publish.isActive()) return;
    try {
      await source.publish.webRTCPeer?.updateBitrate(bitrate);
      dispatch({ type: PublisherActionType.UPDATE_SOURCE_BITRATE, sourceId, bitrate });
    } catch (error: unknown) {
      handleInternalError(error);
    }
  };

  return {
    startStreamingSource,
    stopStreamingSource,
    updateSourceMediaStream,
    updateSourceBitrate,
    sources,
    codecList,
    bitrateList,
    viewerCount,
    shareUrl,
  };
};

export * from './types';
export default usePublisher;
