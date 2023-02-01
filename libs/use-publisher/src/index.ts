import {
  BroadcastEvent,
  BroadcastOptions,
  Director,
  Event,
  PeerConnection,
  Publish,
  StreamStats,
  VideoCodec,
  ViewerCount,
} from '@millicast/sdk';
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { bitrateList } from './constants';

import reducer from './reducer';
import { Publisher, PublisherActionType, PublisherProps, PublisherSource, PublisherSources } from './types';

const usePublisher = ({
  handleError,
  streamNameId,
  streams,
  streamName,
  token,
  viewerAppBaseUrl,
}: PublisherProps): Publisher => {
  const viewerCountIdRef = useRef<string>();

  const [sources, dispatch] = useReducer(reducer, new Map() as PublisherSources);

  const [codecList, setCodecList] = useState<VideoCodec[]>([] as VideoCodec[]);
  const [viewerCount, setViewerCount] = useState(0);

  useEffect(() => {
    return () => {
      sources.forEach((_, id) => {
        stopStreamingToSource(id);
      });
    };
  }, []);

  useEffect(() => {
    // Add new streams
    streams.forEach((stream, streamId) => {
      if (sources.get(streamId)) {
        return;
      }

      const { label, mediaStream } = stream;

      const broadcastOptions = {
        bandwidth: bitrateList[0].value,
        codec: codecList[0],
        events: ['viewercount'] as Event[],
        mediaStream,
        simulcast: codecList[0] === 'h264',
        sourceId: label ?? streamId,
      };

      const publish = new Publish(streamName, tokenGenerator, true);

      const newSource: PublisherSource = {
        broadcastOptions,
        publish,
        state: 'ready',
      };

      dispatch({ id: streamId, source: newSource, type: PublisherActionType.ADD_SOURCE });
    });

    // Remove old streams
    sources.forEach((_, id) => {
      if (!streams.get(id)) {
        dispatch({ id, type: PublisherActionType.REMOVE_SOURCE });
      }
    });
  }, [streams]);

  // Handle internal list of codecs
  useEffect(() => {
    const capabilities = PeerConnection.getCapabilities('video');

    const supportedCodecs = capabilities.codecs
      .filter(({ codec }) => codec !== 'av1')
      .sort(({ codec }) => (codec === 'h264' ? -1 : 1))
      .map(({ codec }) => codec);

    setCodecList(supportedCodecs);
  }, []);

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

  const handleStats = (id: string) => (statistics: StreamStats) => {
    dispatch({ id, statistics, type: PublisherActionType.UPDATE_SOURCE_STATISTICS });
  };

  const shareUrl = viewerAppBaseUrl
    ? `${viewerAppBaseUrl}?streamAccountId=${streamNameId}&streamName=${streamName}`
    : undefined;

  const startStreamingToSource = async (id: string) => {
    const source = sources.get(id);

    if (!source || source.publish.isActive() || !source.broadcastOptions.mediaStream) {
      return;
    }

    try {
      dispatch({ id, state: 'connecting', type: PublisherActionType.UPDATE_SOURCE_STATE });

      await source.publish.connect(source.broadcastOptions as BroadcastOptions);

      dispatch({ id, state: 'streaming', type: PublisherActionType.UPDATE_SOURCE_STATE });

      source.publish.webRTCPeer?.initStats();
      source.publish.webRTCPeer?.addListener('stats', handleStats(id));

      if (!viewerCountIdRef.current) {
        viewerCountIdRef.current = id;

        source.publish.addListener('broadcastEvent', handleBroadcastEvent);
      }
    } catch (error) {
      dispatch({ id, type: PublisherActionType.REMOVE_SOURCE });

      handleInternalError(error);
    }
  };

  const stopStreamingToSource = (id: string) => {
    const source = sources.get(id);

    if (!source) {
      return;
    }

    source.publish.webRTCPeer?.stopStats();
    source.publish.webRTCPeer?.removeAllListeners('stats');
    source.publish.stop();

    dispatch({ id, state: 'ready', type: PublisherActionType.UPDATE_SOURCE_STATE });

    if (viewerCountIdRef.current === id) {
      source.publish.removeAllListeners('broadcastEvent');

      if (sources.size > 1) {
        const [nextId, nextSource] = Array.from(sources.entries()).find(([key]) => key !== id) ?? [];

        if (nextId) {
          viewerCountIdRef.current = nextId;

          nextSource?.publish.addListener('broadcastEvent', handleBroadcastEvent);
        }
      } else {
        viewerCountIdRef.current = undefined;
      }
    }
  };

  const tokenGenerator = useCallback(() => Director.getPublisher({ streamName, token }), [streamName, token]);

  const updateSourceMediaStream = (id: string, mediaStream: MediaStream) => {
    const source = sources.get(id);

    if (!source) {
      return;
    }

    const [audioTrack] = mediaStream.getAudioTracks();
    const [videoTrack] = mediaStream.getVideoTracks();

    if (source.publish.isActive()) {
      if (audioTrack) {
        source.publish.webRTCPeer?.replaceTrack(audioTrack);
      }

      if (videoTrack) {
        source.publish.webRTCPeer?.replaceTrack(videoTrack);
      }
    }

    dispatch({ broadcastOptions: { mediaStream }, id, type: PublisherActionType.UPDATE_SOURCE_BROADCAST_OPTIONS });
  };

  const updateSourceBroadcastOptions = async (id: string, broadcastOptions: Partial<BroadcastOptions>) => {
    const source = sources.get(id);

    if (!source) {
      return;
    }

    if (source.publish.isActive()) {
      // Only bandwidth is alterable while livestreaming
      if ('bandwidth' in broadcastOptions) {
        const { bandwidth } = broadcastOptions;

        try {
          await source.publish.webRTCPeer?.updateBitrate(bandwidth);

          dispatch({ broadcastOptions: { bandwidth }, id, type: PublisherActionType.UPDATE_SOURCE_BROADCAST_OPTIONS });
        } catch (error) {
          handleInternalError(error);
        }
      }

      return;
    }

    dispatch({ broadcastOptions, id, type: PublisherActionType.UPDATE_SOURCE_BROADCAST_OPTIONS });
  };

  return {
    codecList,
    shareUrl,
    sources,
    startStreamingToSource,
    stopStreamingToSource,
    updateSourceBroadcastOptions,
    updateSourceMediaStream,
    viewerCount,
  };
};

export * from './constants';
export * from './types';
export default usePublisher;
