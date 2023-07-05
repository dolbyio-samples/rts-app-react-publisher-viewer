import WebRTCStats, { OnStats } from '@dolbyio/webrtc-stats';
import { BroadcastEvent, Director, MediaStreamLayers, MediaStreamSource, View, ViewerCount } from '@millicast/sdk';
import { useReducer, useRef, useState } from 'react';

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
  const [mainMediaStream, setMainMediaStream] = useState<MediaStream>();
  const [mainSourceId, setMainSourceId] = useState<string>();
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
          const newRemoteTrackSource = await addRemoteTrack(viewer, sourceId || DEFAULT_MAIN_SOURCE_ID, tracks);
          dispatch({ remoteTrackSource: newRemoteTrackSource, sourceId, type: ViewerActionType.ADD_SOURCE });
          if (!remoteTrackSourcesRef.current?.size && activeEventCounter === 1) {
            setMainMediaStream(newRemoteTrackSource.mediaStream);
            setMainSourceId(sourceId);
            mainAudioMIDRef.current = newRemoteTrackSource.audioMediaId;
            mainVideoMIDRef.current = newRemoteTrackSource.videoMediaId;
          }
          await viewer.project(sourceId, generateProjectMapping(newRemoteTrackSource));
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

  const projectToMainStream = async (sourceId: string): Promise<void> => {
    const { current: viewer } = viewerRef;

    if (!viewer || !mainSourceId) {
      return;
    }

    const remoteTrackSource = remoteTrackSources.get(sourceId);
    const mainTrackSource = remoteTrackSources.get(mainSourceId);
    if (remoteTrackSource && mainTrackSource && mainMediaStream) {
      try {
        await projectToStream(viewer, mainTrackSource, remoteTrackSource.audioMediaId, remoteTrackSource.videoMediaId);
        await projectToStream(viewer, remoteTrackSource, mainAudioMIDRef.current, mainVideoMIDRef.current);
        dispatch({
          payload: [
            {
              sourceId,
              mediaStream: mainMediaStream,
              audioMID: mainAudioMIDRef.current,
              videoMID: mainVideoMIDRef.current,
            },
            {
              sourceId: mainSourceId,
              mediaStream: remoteTrackSource.mediaStream,
              audioMID: remoteTrackSource.audioMediaId,
              videoMID: remoteTrackSource.videoMediaId,
            },
          ],
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
    const { current: viewer } = viewerRef;
    if (!viewer) {
      return;
    }
    const { streamQuality = 'Auto', simulcastLayer } = quality ?? {};
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
  };

  const startViewer = async () => {
    if (!viewerRef.current?.isActive()) {
      try {
        const viewer = new View(streamName, tokenGenerator);

        viewer.on('broadcastEvent', handleBroadcastEvent);
        viewer.on('connectionStateChange', handleConnectionStateChange);
        // viewer.on('track', handleTrack);

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
