import { useCallback, useEffect, useRef, useMemo, useReducer } from 'react';
import useState from 'react-usestateref';
import {
  Director,
  LayerInfo,
  MediaLayer,
  MediaStreamLayers,
  MediaTrackInfo,
  StreamAudioInboundsStats,
  StreamVideoInboundsStats,
  View,
  ViewerCount,
} from '@millicast/sdk';
import { MediaStreamSource, ViewOptions, BroadcastEvent, ViewProjectSourceMapping } from '@millicast/sdk';

import type { StreamStats } from '@millicast/sdk';
import { RemoteTrackSources, ViewerAction, ViewerActionType, ViewerProps, Viewer } from './types';
import { addRemoteTrackAndProject, buildQualityOptions, unprojectAndRemoveRemoteTrack } from './utils';

const missedSourceId = new Date().valueOf().toString();
const initialRemoteSources = new Map() as RemoteTrackSources;

const reducer = (sources: RemoteTrackSources, action: ViewerAction): RemoteTrackSources => {
  switch (action.type) {
    case ViewerActionType.ADD_SOURCE: {
      console.log('add source', action.source.sourceId, 'old sources', sources);
      if (sources.get(action.source.sourceId)) return sources;
      const newSources = new Map(sources) as RemoteTrackSources;
      newSources.set(action.source.sourceId, action.source);
      console.log('newSources', newSources);
      return newSources;
    }
    case ViewerActionType.REMOVE_SOURCE: {
      console.log('remove source', action.sourceId);
      const source = sources.get(action.sourceId);
      if (!source) return sources;
      unprojectAndRemoveRemoteTrack(source, action.viewer);
      const newSources = new Map(sources) as RemoteTrackSources;
      newSources.delete(action.sourceId);
      return newSources;
    }
    case ViewerActionType.UPDATE_SOURCES_STATISTICS: {
      const { audio, video } = action.statistics;
      const newSources = new Map() as RemoteTrackSources;
      for (const [id, source] of sources) {
        const audioIn = audio.inbounds?.filter(({ mid }) => mid === source.audioMediaId) ?? [];
        const videoIn = video.inbounds?.filter(({ mid }) => mid === source.videoMediaId) ?? [];
        const newSource = {
          ...source,
          statistics: {
            ...action.statistics,
            audio: { inbounds: audioIn },
            video: { inbounds: videoIn },
          },
        };
        newSources.set(id, newSource);
      }
      return newSources;
    }
    case ViewerActionType.UPDATE_SOURCES_QUALITIES: {
      const newSources = new Map(sources) as RemoteTrackSources;
      Object.entries(action.medias).forEach(([mid, { active }]) => {
        const [id, source] = Array.from(sources).find(([, { videoMediaId }]) => videoMediaId === mid) ?? [];
        if (id && source) {
          const newSource = {
            ...source,
            streamQualityOptions: buildQualityOptions(active),
          };
          newSources.set(id, newSource);
        }
      });
      return newSources;
    }
    default:
      return sources;
  }
};

const useViewer = ({ streamName, streamAccountId, subscriberToken, handleError }: ViewerProps): Viewer => {
  const viewer = useRef<View>();
  const [viewerCount, setViewerCount] = useState<number>(0);
  const [remoteTrackSources, dispatch] = useReducer(reducer, initialRemoteSources);

  const handleInternalError = (error: unknown) => {
    if (error instanceof Error) {
      handleError?.(error.message);
    } else {
      handleError?.(`${error}`);
    }
  };

  // useEffect(() => {
  //   switch (viewerState) {
  //     case 'liveOff':
  //       viewer.current?.webRTCPeer?.stopStats();
  //       viewer.current?.webRTCPeer?.removeListener('stats', statisticsEventHandler);
  //       break;
  //     case 'liveOn':
  //       {
  //         viewer.current?.webRTCPeer?.initStats();
  //         viewer.current?.webRTCPeer?.addListener('stats', statisticsEventHandler);
  //       }
  //       break;
  //     default:
  //       break;
  //   }
  // }, [viewerState]);

  // const updateSourceQuality = (sourceId: SourceId, quality: StreamQuality) => {
  //   if (!viewer.current) return;
  //   const option = streamQualityOptions.find((option) => option.streamQuality === selectedQuality);
  //   if (!option) return;
  //   streamQuality.current = selectedQuality;
  //   if (selectedQuality === 'Auto') {
  //     viewer.current.select({});
  //   } else {
  //     viewer.current.select(option.simulcastLayer);
  //   }
  // };

  const broadcastEventHandler = useCallback(async (event: BroadcastEvent) => {
    console.log('got event');
    if (!viewer.current) return;
    console.log('broadcast event', event);
    switch (event.name) {
      case 'active':
        {
          console.log('active event');
          const source = event.data as MediaStreamSource;
          if (!source.sourceId) source.sourceId = missedSourceId;
          try {
            const trackSource = await addRemoteTrackAndProject(source.sourceId, source.tracks, viewer.current);
            setTimeout(() => {
              dispatch({ type: ViewerActionType.ADD_SOURCE, source: trackSource });
            }, 1000);
          } catch (error) {
            handleInternalError(error);
          }
        }
        break;
      case 'inactive':
        {
          const source = event.data as MediaStreamSource;
          if (!source.sourceId) source.sourceId = missedSourceId;
          dispatch({ type: ViewerActionType.REMOVE_SOURCE, sourceId: source.sourceId, viewer: viewer.current });
        }
        break;
      case 'viewercount':
        setViewerCount((event.data as ViewerCount).viewercount);
        break;
      case 'layers': {
        dispatch({
          medias: (event.data as MediaStreamLayers).medias,
          type: ViewerActionType.UPDATE_SOURCES_QUALITIES,
          viewer: viewer.current as View,
        });
        break;
      }
    }
  }, []);

  const connect = async () => {
    if (!viewer.current) return;
    console.log('connecting');
    try {
      await viewer.current.connect({ events: ['active', 'inactive', 'layers', 'viewercount'] });
    } catch (error) {
      console.error(error);
      viewer.current?.reconnect();
    } finally {
      console.log('register broadcastEvent');
      viewer.current?.webRTCPeer?.initStats();
      viewer.current?.webRTCPeer?.on('stats', (statistics: StreamStats) => {
        dispatch({
          statistics,
          type: ViewerActionType.UPDATE_SOURCES_STATISTICS,
          viewer: viewer.current as View,
        });
      });
    }
  };

  const startViewer = async () => {
    console.log('start viewer', streamName, streamAccountId);
    if (viewer.current?.isActive()) return;
    try {
      const tokenGenerator = () => Director.getSubscriber({ streamName, streamAccountId, subscriberToken });
      viewer.current = new View(streamName, tokenGenerator);
      viewer.current.on('broadcastEvent', broadcastEventHandler);
      connect();
    } catch (error) {
      handleInternalError(error);
    }
  };

  const stopViewer = () => {
    if (!viewer.current) return;
    console.log('stop viewer');
    const curViewer = viewer.current;
    viewer.current = undefined;
    curViewer.removeAllListeners('broadcastEvent');
    curViewer.webRTCPeer?.removeAllListeners('stats');
    curViewer.webRTCPeer?.stopStats();
    curViewer.stop();
  };

  return {
    startViewer,
    stopViewer,
    remoteTrackSources,
    viewerCount,
    // updateSourceQuality,
  };
};

export * from './types';
export default useViewer;
