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
import { addRemoteTrackAndProject, unprojectAndRemoveRemoteTrack } from './utils';

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

  // const buildQualityOptions = (layers: MediaLayer[]) => {
  //   if (layers.length > 3 || layers.length < 2) return;
  //   const qualities: StreamQuality[] = layers.length === 3 ? ['High', 'Medium', 'Low'] : ['High', 'Low'];
  //   const newStreamQualityOptions: SimulcastQuality[] = layers.map((layer, idx) => {
  //     return {
  //       streamQuality: qualities[idx],
  //       simulcastLayer: {
  //         encodingId: layer.id,
  //         bitrate: layer.bitrate,
  //         simulcastIdx: layer.simulcastIdx,
  //         spatialLayerId: layer.layers[0]?.spatialLayerId, // H264 doesn't have layers.
  //         temporalLayerId: layer.layers[0]?.temporalLayerId, // H264 doesn't have layers.
  //       },
  //     };
  //   });
  //   newStreamQualityOptions.unshift({
  //     streamQuality: 'Auto',
  //   });
  //   setStreamQualityOptions(newStreamQualityOptions);
  // };

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
        // We only check active layers for main stream which always has media id 0
        // const layers = (event.data as MediaStreamLayers).medias['0']?.active;
        // if (!layers || layers.length == 0) {
        //   setStreamQualityOptions([]);
        //   return;
        // }
        // buildQualityOptions(layers);
        // if (!streamQuality.current) {
        //   streamQuality.current = 'Auto';
        //   viewer.current?.select({});
        // }
        break;
      }
    }
  }, []);

  const connect = async () => {
    if (!viewer.current) return;
    console.log('connecting');
    try {
      await viewer.current.connect();
    } catch (error) {
      console.error(error);
      viewer.current?.reconnect();
    } finally {
      console.log('register broadcastEvent');
      viewer.current?.webRTCPeer?.initStats();
      viewer.current?.webRTCPeer?.on('stats', (statistics: StreamStats) => {
        // console.log('statistics event', statistics);
        // const videoInbounds = statistics.video.inbounds.filter((stats) => stats.mid === mainVideoMidRef.current);
        // if (videoInbounds) statistics.video.inbounds = videoInbounds;
        // const audioInbounds = statistics.audio.inbounds.filter((stats) => stats.mid === mainAudioMidRef.current);
        // if (audioInbounds) statistics.audio.inbounds = audioInbounds;
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
