import WebRTCStats, { OnStats } from '@dolbyio/webrtc-stats';
import { BroadcastEvent, Director, MediaStreamLayers, MediaStreamSource, View, ViewerCount } from '@millicast/sdk';
import { useReducer, useRef } from 'react';
import useState from 'react-usestateref';

import reducer from './reducer';
import { RemoteTrackSources, SimulcastQuality, Viewer, ViewerActionType, ViewerProps } from './types';
import {
  addRemoteTrack,
  buildQualityOptions,
  generateProjectMapping,
  projectToStream,
  unprojectFromStream,
} from './utils';

const GET_STATS_INTERVAL = 1000;
const DEFAULT_MAIN_SOURCE_ID = 'main_undefined';

const useViewer = ({ handleError, streamAccountId, streamName, subscriberToken }: ViewerProps): Viewer => {
  const collectionRef = useRef<WebRTCStats>();
  const viewerRef = useRef<View>();

  const [remoteTrackSources, dispatch] = useReducer(reducer, new Map() as RemoteTrackSources);

  const remoteTrackSourcesRef = useRef<RemoteTrackSources>();
  remoteTrackSourcesRef.current = remoteTrackSources;

  // Use this to keep track of the quantity of concurrent active event handlers
  const activeEventCounterRef = useRef(0);
  const mainAudioMIDRef = useRef<string>();
  const mainVideoMIDRef = useRef<string>();
  const [mainMediaStream, setMainMediaStream, mainMediaStreamRef] = useState<MediaStream>();
  const [mainSourceId, setMainSourceId, mainSourceIdRef] = useState<string>();
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
          const srcId = sourceId || DEFAULT_MAIN_SOURCE_ID;
          const activeEventCounter = activeEventCounterRef.current + 1;
          activeEventCounterRef.current = activeEventCounter;
          const newRemoteTrackSource = await addRemoteTrack(viewer, srcId, tracks);
          dispatch({ remoteTrackSource: newRemoteTrackSource, sourceId, type: ViewerActionType.ADD_SOURCE });
          if (!remoteTrackSourcesRef.current?.size && activeEventCounter === 1) {
            setMainMediaStream(newRemoteTrackSource.mediaStream);
            setMainSourceId(srcId);
            mainAudioMIDRef.current = newRemoteTrackSource.audioMediaId;
            mainVideoMIDRef.current = newRemoteTrackSource.videoMediaId;
          }
          await viewer.project(srcId, generateProjectMapping(newRemoteTrackSource));
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
            if (sourceId === mainSourceIdRef.current && remoteTrackSourcesRef.current) {
              const nextSourceId = Array.from(remoteTrackSourcesRef.current.keys()).find(
                (sourceId) => sourceId !== mainSourceIdRef.current
              );
              if (nextSourceId) {
                projectToMainStream(nextSourceId, false);
                const nextTrack = remoteTrackSourcesRef.current.get(nextSourceId);
                remoteTrackSource.audioMediaId = nextTrack?.audioMediaId;
                remoteTrackSource.videoMediaId = nextTrack?.videoMediaId;
              }
            }
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
        const mediaId = mainVideoMIDRef.current;

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

    const mainAudio = audio.filter(({ mid }) => mid === mainAudioMIDRef.current) ?? [];
    const mainVideo = video.filter(({ mid }) => mid === mainVideoMIDRef.current) ?? [];

    setMainStatistics({ ...statistics, input: { audio: mainAudio, video: mainVideo } });
  };

  // Project the tracks specified by the source ID to main stream
  // It will swap the current tracks in main stream with the target tracks if `shouldSwap` is true
  const projectToMainStream = async (sourceId: string, shouldSwap = true): Promise<void> => {
    const { current: viewer } = viewerRef;

    if (!viewer || !mainSourceIdRef.current || !remoteTrackSourcesRef.current || !mainMediaStreamRef.current) {
      return;
    }
    const remoteTrackSources = remoteTrackSourcesRef.current;
    const mainMediaStream = mainMediaStreamRef.current;
    const remoteTrackSource = remoteTrackSources.get(sourceId);
    const mainTrackSource = remoteTrackSources.get(mainSourceIdRef.current);
    if (remoteTrackSource && mainTrackSource && mainMediaStream) {
      try {
        const actionPayload = [
          {
            sourceId,
            mediaStream: mainMediaStream,
            audioMID: mainAudioMIDRef.current,
            videoMID: mainVideoMIDRef.current,
          },
        ];
        if (shouldSwap) {
          await projectToStream(
            viewer,
            mainTrackSource,
            remoteTrackSource.audioMediaId,
            remoteTrackSource.videoMediaId
          );
          actionPayload.push({
            sourceId: mainSourceIdRef.current,
            mediaStream: remoteTrackSource.mediaStream,
            audioMID: remoteTrackSource.audioMediaId,
            videoMID: remoteTrackSource.videoMediaId,
          });
        }
        await projectToStream(viewer, remoteTrackSource, mainAudioMIDRef.current, mainVideoMIDRef.current);
        dispatch({
          payload: actionPayload,
          type: ViewerActionType.UPDATE_SOURCE_MEDIA,
        });
        setMainSourceId(sourceId);
        setSourceQuality(sourceId);
      } catch (error) {
        handleInternalError(error);
        return Promise.reject(error);
      }
    }
  };

  const setSourceQuality = async (sourceId: string, quality?: SimulcastQuality) => {
    const viewer = viewerRef.current;
    if (!viewer) {
      return;
    }
    const { streamQuality = 'Auto', simulcastLayer } = quality ?? {};
    try {
      if (streamQuality === 'Auto') {
        await viewer.select();
      } else {
        await viewer.select(simulcastLayer);
      }
      dispatch({
        quality: streamQuality,
        sourceId,
        type: ViewerActionType.UPDATE_SOURCE_QUALITY,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const startViewer = async () => {
    if (!viewerRef.current?.isActive()) {
      try {
        const viewer = new View(streamName, tokenGenerator);

        viewer.on('broadcastEvent', handleBroadcastEvent);
        viewer.on('connectionStateChange', handleConnectionStateChange);

        const collection = new WebRTCStats({
          getStatsInterval: GET_STATS_INTERVAL,
          getStats: () => {
            if (!viewer.webRTCPeer) return Promise.reject();
            return viewer.webRTCPeer.getRTCPeer().getStats();
          },
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
    mainSourceId,
    mainQualityOptions,
    mainStatistics,
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
