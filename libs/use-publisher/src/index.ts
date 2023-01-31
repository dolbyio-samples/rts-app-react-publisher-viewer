import { BroadcastEvent, BroadcastOptions, Director, Publish, StreamStats, ViewerCount } from '@millicast/sdk';
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';

import reducer from './reducer';
import { Publisher, PublisherActionType, PublisherProps, PublisherSource, PublisherSources } from './types';

const usePublisher = ({ handleError, streamId, streamName, token, viewerAppBaseUrl }: PublisherProps): Publisher => {
  const viewerCountSourceIdRef = useRef<string>();

  const [sources, dispatch] = useReducer(reducer, new Map() as PublisherSources);
  const [viewerCount, setViewerCount] = useState(0);

  useEffect(() => {
    return () => {
      sources.forEach((source) => {
        stopStreamingToSource(source.broadcastOptions.sourceId);
      });
    };
  }, []);

  const connectSource = async (source: PublisherSource) => {
    if (source.publish.isActive()) {
      return;
    }

    const { sourceId } = source.broadcastOptions;

    try {
      dispatch({ sourceId, state: 'connecting', type: PublisherActionType.UPDATE_SOURCE_STATE });

      await source.publish.connect(source.broadcastOptions);

      dispatch({ sourceId, state: 'streaming', type: PublisherActionType.UPDATE_SOURCE_STATE });

      source.publish.webRTCPeer?.initStats();
      source.publish.webRTCPeer?.addListener('stats', handleStats(sourceId));

      if (!viewerCountSourceIdRef.current) {
        viewerCountSourceIdRef.current = sourceId;

        source.publish.addListener('broadcastEvent', handleBroadcastEvent);
      }
    } catch (error) {
      dispatch({ sourceId, type: PublisherActionType.REMOVE_SOURCE });

      handleInternalError(error);
    }
  };

  const handleBroadcastEvent = (event: BroadcastEvent) => {
    if (event.name === 'viewercount') setViewerCount((event.data as ViewerCount).viewercount);
  };

  const handleInternalError = (error: unknown) => {
    if (error instanceof Error) {
      handleError?.(error.message);
    } else {
      handleError?.(`${error}`);
    }
  };

  const handleStats = (sourceId: string) => (statistics: StreamStats) => {
    dispatch({ sourceId, statistics, type: PublisherActionType.UPDATE_SOURCE_STATISTICS });
  };

  const shareUrl = viewerAppBaseUrl
    ? `${viewerAppBaseUrl}?streamAccountId=${streamId}&streamName=${streamName}`
    : undefined;

  const startStreamingToSource = async (broadcastOptions: BroadcastOptions) => {
    const { sourceId } = broadcastOptions;

    if (sources.get(sourceId)) {
      return;
    }

    const publish = new Publish(streamName, tokenGenerator, true);

    const newSource: PublisherSource = {
      broadcastOptions,
      publish,
      state: 'ready',
    };

    dispatch({ source: newSource, type: PublisherActionType.ADD_SOURCE });

    await connectSource(newSource);
  };

  const stopStreamingToSource = (sourceId: string) => {
    const source = sources.get(sourceId);

    if (!source) {
      return;
    }

    source.publish.webRTCPeer?.stopStats();
    source.publish.webRTCPeer?.removeAllListeners('stats');
    source.publish.stop();

    if (viewerCountSourceIdRef.current === sourceId) {
      source.publish.removeAllListeners('broadcastEvent');

      if (sources.size > 1) {
        const [nextSourceId, nextSource] = Array.from(sources.entries()).find(([key]) => key !== sourceId) ?? [];

        if (nextSourceId) {
          viewerCountSourceIdRef.current = nextSourceId;

          nextSource?.publish.addListener('broadcastEvent', handleBroadcastEvent);
        }
      } else {
        viewerCountSourceIdRef.current = undefined;
      }
    }

    dispatch({ sourceId, type: PublisherActionType.REMOVE_SOURCE });
  };

  const tokenGenerator = useCallback(() => Director.getPublisher({ streamName, token }), [streamName, token]);

  const updateSourceBitrate = async (sourceId: string, bitrate: number) => {
    const source = sources.get(sourceId);

    if (!source?.publish.isActive()) {
      return;
    }

    try {
      await source.publish.webRTCPeer?.updateBitrate(bitrate);

      dispatch({ bitrate, sourceId, type: PublisherActionType.UPDATE_SOURCE_BITRATE });
    } catch (error) {
      handleInternalError(error);
    }
  };

  return {
    shareUrl,
    sources,
    startStreamingToSource,
    stopStreamingToSource,
    updateSourceBitrate,
    viewerCount,
  };
};

export * from './types';
export default usePublisher;
