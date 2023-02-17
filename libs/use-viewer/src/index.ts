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
import {
  RemoteTrackSource,
  RemoteTrackSources,
  SimulcastQuality,
  Viewer,
  ViewerActionType,
  ViewerProps,
} from './types';
import { addRemoteTrack, unprojectFromStream, projectToStream } from './utils';

const useViewer = ({ handleError, streamAccountId, streamName, subscriberToken }: ViewerProps): Viewer => {
  const viewerRef = useRef<View>();

  const [remoteTrackSources, dispatch] = useReducer(reducer, new Map() as RemoteTrackSources);

  const remoteTrackSourcesRef = useRef<RemoteTrackSources>();
  remoteTrackSourcesRef.current = remoteTrackSources;

  // Use this to keep track of the quantity of concurrent active event handlers
  const activeEventCounterRef = useRef(0);
  const mainAudioMappingRef = useRef<ViewProjectSourceMapping>();
  const mainVideoMappingRef = useRef<ViewProjectSourceMapping>();

  const [mainMediaStream, setMainMediaStream] = useState<MediaStream>();
  const [mainStatistics, setMainStatistics] = useState<StreamStats>();
  const [viewerCount, setViewerCount] = useState<number>(0);

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
    } catch {
      try {
        await viewer.reconnect();
      } catch (error) {
        handleInternalError(error);
      }
    }
  };

  const handleBroadcastEvent = async (event: BroadcastEvent) => {
    const { current: viewer } = viewerRef;

    if (!viewer) {
      return;
    }

    const { sourceId = new Date().valueOf().toString(), tracks } = event.data as MediaStreamSource;

    switch (event.name) {
      case 'active':
        try {
          const activeEventCounter = activeEventCounterRef.current + 1;
          activeEventCounterRef.current = activeEventCounter;

          const newRemoteTrackSource = await addRemoteTrack(viewer, sourceId, tracks);

          dispatch({ remoteTrackSource: newRemoteTrackSource, sourceId, type: ViewerActionType.ADD_SOURCE });

          try {
            // Project to main stream if there are currently no remote tracks and it is the first active event
            if (!remoteTrackSourcesRef.current?.size && activeEventCounter === 1) {
              await projectToStream(
                viewer,
                newRemoteTrackSource,
                mainAudioMappingRef.current,
                mainVideoMappingRef.current
              );
            } else {
              await viewer.project(sourceId, newRemoteTrackSource.projectMapping);
            }
          } catch (error) {
            handleInternalError(error);
          }
        } catch (error) {
          handleInternalError(error);
        } finally {
          activeEventCounterRef.current = activeEventCounterRef.current - 1;
        }

        break;

      case 'inactive': {
        const remoteTrackSource = remoteTrackSourcesRef.current?.get(sourceId);
        if (remoteTrackSource) {
          try {
            dispatch({ sourceId, type: ViewerActionType.REMOVE_SOURCE });
            await unprojectFromStream(viewer, remoteTrackSource);
          } catch (error) {
            handleInternalError(error);
          }
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

  const handleConnectionStateChange = (event: string) => {
    const { current: viewer } = viewerRef;

    if (!viewer) {
      return;
    }

    if (event === 'closed') {
      viewer.webRTCPeer?.removeAllListeners('stats');
      viewer.webRTCPeer?.stopStats();
    }

    if (event === 'connected') {
      viewer.webRTCPeer?.initStats();
      viewer.webRTCPeer?.on('stats', handleStats);
    }
  };

  const handleStats = (statistics: StreamStats) => {
    const { audio, video } = statistics;

    const audioIn = audio.inbounds?.filter(({ mid }) => mid === mainAudioMappingRef.current?.mediaId) ?? [];
    const videoIn = video.inbounds?.filter(({ mid }) => mid === mainVideoMappingRef.current?.mediaId) ?? [];

    setMainStatistics({ ...statistics, audio: { inbounds: audioIn }, video: { inbounds: videoIn } });

    dispatch({
      statistics,
      type: ViewerActionType.UPDATE_SOURCES_STATISTICS,
    });
  };

  // Get the audio/video media IDs for the main stream from the track event
  // and use them to create the main stream mapping
  const handleTrack = (event: RTCTrackEvent) => {
    const {
      streams: [mediaStream],
      track: { kind },
      transceiver: { mid },
    } = event;

    if (mediaStream && mid !== null) {
      const newMapping = { media: kind, mediaId: mid, trackId: kind };

      setMainMediaStream(mediaStream);

      if (kind === 'audio') {
        mainAudioMappingRef.current = newMapping;
      } else if (kind === 'video') {
        mainVideoMappingRef.current = newMapping;
      }
    }
  };

  const projectToMainStream = async (sourceId: string): Promise<RemoteTrackSource | void> => {
    const { current: viewer } = viewerRef;

    if (!viewer) {
      return;
    }

    const remoteTrackSource = remoteTrackSources.get(sourceId);

    if (remoteTrackSource) {
      try {
        await unprojectFromStream(viewer, remoteTrackSource);
        await projectToStream(viewer, remoteTrackSource, mainAudioMappingRef.current, mainVideoMappingRef.current);

        return remoteTrackSource;
      } catch (error) {
        handleInternalError(error);
      }
    }
  };

  const reprojectFromMainStream = async (sourceId: string) => {
    const { current: viewer } = viewerRef;

    if (!viewer) {
      return;
    }

    const remoteTrackSource = remoteTrackSources.get(sourceId);

    if (remoteTrackSource) {
      try {
        await viewer.project(sourceId, remoteTrackSource.projectMapping);
      } catch (error) {
        handleInternalError(error);
      }
    }
  };

  const setSourceQuality = (sourceId: string, quality?: SimulcastQuality) => {
    const { current: viewer } = viewerRef;

    if (!viewer) {
      return;
    }

    const { streamQuality, simulcastLayer } = quality ?? {};

    if (streamQuality === 'Auto') {
      viewer.select({});
    } else {
      viewer.select(simulcastLayer ?? {});
    }

    dispatch({
      quality: streamQuality ?? 'Auto',
      sourceId,
      type: ViewerActionType.UPDATE_SOURCE_QUALITY,
    });
  };

  const startViewer = async () => {
    if (!viewerRef.current?.isActive()) {
      try {
        const newViewer = new View(streamName, tokenGenerator);

        newViewer.on('broadcastEvent', handleBroadcastEvent);
        newViewer.on('connectionStateChange', handleConnectionStateChange);
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

    if (viewer) {
      viewer.removeAllListeners('broadcastEvent');
      viewer.webRTCPeer?.removeAllListeners('stats');
      viewer.webRTCPeer?.stopStats();
      viewer.stop();

      viewerRef.current = undefined;
    }
  };

  const tokenGenerator = () => Director.getSubscriber({ streamAccountId, streamName, subscriberToken });

  return {
    mainMediaStream,
    mainStatistics,
    projectToMainStream,
    remoteTrackSources,
    reprojectFromMainStream,
    setSourceQuality,
    startViewer,
    stopViewer,
    viewerCount,
  };
};

export * from './types';
export default useViewer;
