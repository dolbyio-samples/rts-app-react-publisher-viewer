import WebRTCStats, { OnStats } from '@dolbyio/webrtc-stats';
import { BroadcastEvent, Director, MediaStreamLayers, MediaStreamSource, View, ViewerCount } from '@millicast/sdk';
import { useReducer, useRef } from 'react';
import useState from 'react-usestateref';
import { first } from 'lodash';

import reducer from './reducer';
import {
  RemoteTrackSources,
  SimulcastQuality,
  Viewer,
  ViewerActionType,
  ViewerProps,
  RemoteTrackSource,
} from './types';
import {
  addRemoteTrack,
  buildQualityOptions,
  delay,
  generateProjectMapping,
  projectToStream,
  unprojectFromStream,
  DEFAULT_MAIN_SOURCE_ID,
} from './utils';

const GET_STATS_INTERVAL = 1000;

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
  const mainVideoTrackIdRef = useRef<string>();
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
    // Note: even we give every source an non-empty ID, we still could receive an null sourceID in the event
    // so we must ignore that source in that case
    const { sourceId, tracks } = event.data as MediaStreamSource;
    const srcId = sourceId || DEFAULT_MAIN_SOURCE_ID;
    switch (event.name) {
      case 'active':
        try {
          const activeEventCounter = activeEventCounterRef.current + 1;
          activeEventCounterRef.current = activeEventCounter;
          let newRemoteTrackSource: RemoteTrackSource;
          if (!remoteTrackSourcesRef.current?.size && activeEventCounter === 1) {
            while (!mainMediaStreamRef.current) await delay(500);
            const audioTrackId = tracks.find(({ media }) => media === 'audio')?.trackId;
            const videoTrackId = tracks.find(({ media }) => media === 'video')?.trackId;
            newRemoteTrackSource = { sourceId: srcId, audioTrackId, videoTrackId };
            newRemoteTrackSource.audioMediaId = mainAudioMIDRef.current;
            newRemoteTrackSource.videoMediaId = mainVideoMIDRef.current;
            newRemoteTrackSource.mediaStream = mainMediaStreamRef.current;
            setMainSourceId(srcId);
            // Note: project function accept undefined sourceId here for main stream
            await viewer.project(sourceId, generateProjectMapping(newRemoteTrackSource));
            dispatch({ remoteTrackSource: newRemoteTrackSource, sourceId: srcId, type: ViewerActionType.ADD_SOURCE });
          } else if (sourceId) {
            newRemoteTrackSource = await addRemoteTrack(viewer, srcId, tracks);
            await viewer.project(srcId, generateProjectMapping(newRemoteTrackSource));
            dispatch({ remoteTrackSource: newRemoteTrackSource, sourceId: srcId, type: ViewerActionType.ADD_SOURCE });
          }
        } catch (error) {
          handleInternalError(error);
        } finally {
          activeEventCounterRef.current = activeEventCounterRef.current - 1;
        }
        break;

      case 'inactive': {
        const remoteTrackSource = remoteTrackSourcesRef.current?.get(srcId);
        if (remoteTrackSource) {
          try {
            if (srcId === mainSourceIdRef.current && remoteTrackSourcesRef.current) {
              const nextSourceId = Array.from(remoteTrackSourcesRef.current.keys()).find(
                (sourceId) => sourceId !== mainSourceIdRef.current
              );
              if (nextSourceId) {
                projectToMainStream(nextSourceId, false);
                const nextTrack = remoteTrackSourcesRef.current.get(nextSourceId);
                remoteTrackSource.audioMediaId = nextTrack?.audioMediaId;
                remoteTrackSource.videoMediaId = nextTrack?.videoMediaId;
              } else {
                setMainSourceId(undefined);
              }
            }
            dispatch({ sourceId: srcId, type: ViewerActionType.REMOVE_SOURCE });
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
        // Viewer.select only works for main stream
        // if we want to change layers for second stream, we should use viewer.project function
        if (mediaId && mediaId === mainVideoMIDRef.current) {
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

    // Safari and Firefox do not report on mid so we fall back to trackIdentifier to easily pick up stats when streaming with multiple sources
    const mainVideo = video.filter(({ trackIdentifier }) => trackIdentifier === mainVideoTrackIdRef.current);

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
    if (remoteTrackSource && mainTrackSource) {
      try {
        const actionPayload = [
          {
            sourceId,
            mediaStream: mainMediaStream,
            audioMID: mainAudioMIDRef.current,
            videoMID: mainVideoMIDRef.current,
          },
        ] as { sourceId: string; mediaStream?: MediaStream; audioMID?: string; videoMID?: string }[];
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
    // Viewer.select only works for main stream
    // if we want to change layers for second stream, we should use viewer.project function
    if (!viewer || sourceId !== mainSourceIdRef.current) {
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

  const handleTrack = (event: RTCTrackEvent) => {
    const {
      streams: [mediaStream],
      track: { kind },
      transceiver: { mid },
    } = event;
    // main stream always has mid 0 for video and mid 1 for audio in current stage
    if (mid !== '0' && mid !== '1') return;

    if (kind === 'audio') {
      mainAudioMIDRef.current = mid || undefined;
    } else if (kind === 'video') {
      mainVideoMIDRef.current = mid || undefined;
      mainVideoTrackIdRef.current = first(mediaStream?.getVideoTracks())?.id;
    }
    setMainMediaStream(mediaStream);
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
