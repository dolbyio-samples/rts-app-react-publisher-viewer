import {
  BroadcastEvent,
  Director,
  MediaStreamLayers,
  MediaStreamSource,
  StreamStats,
  View,
  ViewerCount,
  ViewProjectSourceMapping,
} from '@millicast/sdk';
import { useReducer, useRef, useState } from 'react';

import reducer from './reducer';
import { RemoteTrackSources, SimulcastQuality, SourceId, Viewer, ViewerActionType, ViewerProps } from './types';
import {
  addRemoteTrackAndProject,
  reprojectToMapping,
  reprojectToOriginalMapping,
  unprojectRemoteTrackSource,
} from './utils';

const defaultSourceId = new Date().valueOf().toString();
const initialRemoteTrackSources = new Map() as RemoteTrackSources;

const useViewer = ({ handleError, streamAccountId, streamName, subscriberToken }: ViewerProps): Viewer => {
  const viewerRef = useRef<View>();

  const [remoteTrackSources, dispatch] = useReducer(reducer, initialRemoteTrackSources);

  const [viewerCount, setViewerCount] = useState<number>(0);
  const [mainStreamAudioMapping, setMainStreamAudioMapping] = useState<ViewProjectSourceMapping>();
  const [mainStreamVideoMapping, setMainStreamVideoMapping] = useState<ViewProjectSourceMapping>();

  const handleInternalError = (error: unknown) => {
    if (error instanceof Error) {
      handleError?.(error.message);
    } else {
      handleError?.(`${error}`);
    }
  };

  const connect = async () => {
    const { current: viewer } = viewerRef;

    if (!viewer) {
      return;
    }

    try {
      await viewer.connect({ events: ['active', 'inactive', 'layers', 'viewercount'] });
    } catch (error) {
      console.error(error);

      viewer.reconnect();
    } finally {
      viewer.webRTCPeer?.initStats();
      viewer.webRTCPeer?.on('stats', handleStats);
    }
  };

  const handleBroadcastEvent = async (event: BroadcastEvent) => {
    const { current: viewer } = viewerRef;

    if (!viewer) {
      return;
    }

    const { sourceId = defaultSourceId, tracks } = event.data as MediaStreamSource;

    switch (event.name) {
      case 'active':
        try {
          const newRemoteTrackSource = await addRemoteTrackAndProject(viewer, sourceId, tracks);

          setTimeout(() => {
            dispatch({ remoteTrackSource: newRemoteTrackSource, sourceId, type: ViewerActionType.ADD_SOURCE });
          }, 1000);
        } catch (error) {
          handleInternalError(error);
        }
        break;

      case 'inactive': {
        const remoteTrackSource = remoteTrackSources.get(sourceId);

        if (remoteTrackSource) {
          unprojectRemoteTrackSource(viewer, remoteTrackSource);

          dispatch({ type: ViewerActionType.REMOVE_SOURCE, sourceId });
        }

        break;
      }

      case 'viewercount':
        setViewerCount((event.data as ViewerCount).viewercount);
        break;

      case 'layers': {
        dispatch({
          medias: (event.data as MediaStreamLayers).medias,
          type: ViewerActionType.UPDATE_SOURCES_QUALITY_OPTIONS,
        });
        break;
      }
    }
    return;
  };

  const handleStats = (statistics: StreamStats) => {
    dispatch({
      statistics,
      type: ViewerActionType.UPDATE_SOURCES_STATISTICS,
    });
  };

  // Get the audio/video media IDs for the main stream from the track event
  // and use them to create the main stream mapping
  const handleTrack = (event: RTCTrackEvent) => {
    const {
      streams,
      track: { kind },
      transceiver: { mid },
    } = event;

    if (streams.length && mid !== null) {
      const newMapping = { media: kind, mediaId: mid, trackId: kind };

      if (kind === 'audio') {
        setMainStreamAudioMapping(newMapping);
      } else if (kind === 'video') {
        setMainStreamVideoMapping(newMapping);
      }
    }
  };

  const projectToMainStream = async (sourceId: SourceId, prevSourceId?: SourceId) => {
    const { current: viewer } = viewerRef;

    if (!viewer) {
      return;
    }

    if (prevSourceId) {
      const prevRemoteTrackSource = remoteTrackSources.get(prevSourceId);

      if (prevRemoteTrackSource) {
        await reprojectToOriginalMapping(viewer, prevRemoteTrackSource);
      }
    }

    const currRemoteTrackSource = remoteTrackSources.get(sourceId);

    if (currRemoteTrackSource) {
      await reprojectToMapping(viewer, currRemoteTrackSource, mainStreamAudioMapping, mainStreamVideoMapping);
    }
  };

  const setSourceQuality = (sourceId: SourceId, quality: SimulcastQuality) => {
    const { current: viewer } = viewerRef;

    if (!viewer) {
      return;
    }

    const { streamQuality, simulcastLayer } = quality;

    if (streamQuality === 'Auto') {
      viewer.select({});
    } else {
      viewer.select(simulcastLayer ?? {});
    }

    dispatch({
      quality: streamQuality,
      sourceId,
      type: ViewerActionType.UPDATE_SOURCE_QUALITY,
    });
  };

  const startViewer = async () => {
    if (!viewerRef.current?.isActive()) {
      try {
        const newViewer = new View(streamName, tokenGenerator);

        newViewer.on('broadcastEvent', handleBroadcastEvent);
        newViewer.on('track', handleTrack);

        viewerRef.current = newViewer;

        connect();
      } catch (error) {
        handleInternalError(error);
      }
    }
  };

  const stopViewer = () => {
    const { current: viewer } = viewerRef;

    if (!viewer) {
      return;
    }

    viewer.removeAllListeners('broadcastEvent');
    viewer.webRTCPeer?.removeAllListeners('stats');
    viewer.webRTCPeer?.stopStats();
    viewer.stop();

    viewerRef.current = undefined;
  };

  const tokenGenerator = () => Director.getSubscriber({ streamName, streamAccountId, subscriberToken });

  return {
    projectToMainStream,
    remoteTrackSources,
    setSourceQuality,
    startViewer,
    stopViewer,
    viewerCount,
  };
};

export * from './types';
export default useViewer;
