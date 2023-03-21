import WebRTCStats, { OnStats } from '@dolbyio/webrtc-stats';
import {
  BroadcastEvent,
  Director,
  MediaStreamLayers,
  MediaStreamSource,
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
import { addRemoteTrack, buildQualityOptions, projectToStream, unprojectFromStream } from './utils';

const GET_STATS_INTERVAL = 1000;

const useViewer = ({ handleError, streamAccountId, streamName, subscriberToken }: ViewerProps): Viewer => {
  const collectionRef = useRef<WebRTCStats>();
  const viewerRef = useRef<View>();

  const [remoteTrackSources, dispatch] = useReducer(reducer, new Map() as RemoteTrackSources);

  const remoteTrackSourcesRef = useRef<RemoteTrackSources>();
  remoteTrackSourcesRef.current = remoteTrackSources;

  // Use this to keep track of the quantity of concurrent active event handlers
  const activeEventCounterRef = useRef(0);
  const mainAudioMappingRef = useRef<ViewProjectSourceMapping>();
  const mainVideoMappingRef = useRef<ViewProjectSourceMapping>();

  const [mainMediaStream, setMainMediaStream] = useState<MediaStream>();
  const [mainQualityOptions, setMainQualityOptions] = useState<SimulcastQuality[]>(buildQualityOptions());
  const [mainStatistics, setMainStatistics] = useState<OnStats>();
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

    // Due to CAPI platform limitations, only one source can be unnamed (where sourceId is undefined)
    // By default, the single unnamed source would be treated as the main source
    // If there are multiple unnamed sources, we can not distinguish which events belong to which sources
    // Although this is a known unclosed edge case:
    // In Publisher app, validation is enforced to ensure all sources have a name
    // In current dolby.io dashboard broadcast app, only one source can be published at a time
    const { sourceId, tracks } = event.data as MediaStreamSource;

    switch (event.name) {
      case 'active':
        try {
          const activeEventCounter = activeEventCounterRef.current + 1;
          activeEventCounterRef.current = activeEventCounter;

          const newRemoteTrackSource = await addRemoteTrack(viewer, sourceId, tracks);

          dispatch({ remoteTrackSource: newRemoteTrackSource, sourceId, type: ViewerActionType.ADD_SOURCE });

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

        if (!remoteTrackSourcesRef.current?.size) {
          setMainQualityOptions(buildQualityOptions());
        }

        break;
      }

      case 'viewercount':
        setViewerCount((event.data as ViewerCount).viewercount);
        break;

      case 'layers': {
        const { mediaId } = mainVideoMappingRef.current ?? {};

        if (mediaId) {
          const mid = parseInt(mediaId, 10);
          const { active } = (event.data as MediaStreamLayers).medias[mid] ?? {};

          setMainQualityOptions(buildQualityOptions(active));
        }

        break;
      }
    }
    return;
  };

  const handleConnectionStateChange = (event: string) => {
    const { current: collection } = collectionRef;

    if (event === 'closed') {
      collection?.stop();
    }

    if (event === 'connected') {
      collection?.stop();
      collection?.start();
    }
  };

  const handleStats = (statistics: OnStats) => {
    const { audio, video } = statistics.input;

    const mainAudio = audio.filter(({ mid }) => mid === mainAudioMappingRef.current?.mediaId) ?? [];
    const mainVideo = video.filter(({ mid }) => mid === mainVideoMappingRef.current?.mediaId) ?? [];

    setMainStatistics({ ...statistics, input: { audio: mainAudio, video: mainVideo } });
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

  const projectToMainStream = async (sourceId?: string): Promise<RemoteTrackSource | void> => {
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

  const reprojectFromMainStream = async (sourceId?: string) => {
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

  const setSourceQuality = (sourceId?: string, quality?: SimulcastQuality) => {
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
        const viewer = new View(streamName, tokenGenerator);

        viewer.on('broadcastEvent', handleBroadcastEvent);
        viewer.on('connectionStateChange', handleConnectionStateChange);
        viewer.on('track', handleTrack);

        const collection = new WebRTCStats({
          getStatsInterval: GET_STATS_INTERVAL,
          getStats: () => viewer.webRTCPeer?.getRTCPeer().getStats(),
        });

        collection.on('stats', handleStats);

        collectionRef.current = collection;
        viewerRef.current = viewer;

        connect();
      } catch (error) {
        handleInternalError(error);
      }
    }
  };

  const stopViewer = () => {
    const { current: viewer } = viewerRef;
    const { current: collection } = collectionRef;

    if (viewer) {
      viewer.removeAllListeners('broadcastEvent');
      collection?.stop();
      viewer.stop();

      viewerRef.current = undefined;
    }
  };

  const tokenGenerator = () => Director.getSubscriber({ streamAccountId, streamName, subscriberToken });

  return {
    mainMediaStream,
    mainQualityOptions,
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
