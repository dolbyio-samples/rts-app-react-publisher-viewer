import { useState, useEffect, useReducer } from 'react';

type AddStreamActionOptions = {
  type: StreamTypes;
  microphone?: InputDeviceInfo;
  camera?: InputDeviceInfo;
  audioConstraints?: MediaTrackConstraints;
  videoConstraints?: MediaTrackConstraints;
};

type ApplyConstraintsOptions = {
  id: StreamId;
  audioConstraints?: MediaTrackConstraints;
  videoConstraints?: MediaTrackConstraints;
};

export type MediaDevices = {
  cameraList: InputDeviceInfo[];
  microphoneList: InputDeviceInfo[];
  streams: StreamsMap;
  initDefaultStream: () => void;
  addStream: ({
    type,
    microphone,
    camera,
    audioConstraints,
    videoConstraints,
  }: AddStreamActionOptions) => Promise<void>;
  toggleAudio: (id: StreamId) => void;
  toggleVideo: (id: StreamId) => void;
  removeStream: (id: StreamId) => void;
  applyConstraints: ({ id, audioConstraints, videoConstraints }: ApplyConstraintsOptions) => Promise<void>;
  reset: () => void;
};

export type Resolution = {
  name?: string;
  width: number;
  height: number;
};

const allResolutions: Resolution[] = [
  {
    name: '4K',
    width: 3840,
    height: 2160,
  },
  {
    name: 'QHD',
    width: 2560,
    height: 1440,
  },
  {
    name: 'FHD',
    width: 1920,
    height: 1080,
  },
  {
    name: 'HD',
    width: 1280,
    height: 720,
  },
  {
    name: '480p',
    width: 854,
    height: 480,
  },
  {
    name: 'SD',
    width: 640,
    height: 480,
  },
  {
    name: '360p',
    width: 640,
    height: 360,
  },
];

export enum StreamTypes {
  MEDIA = 'MEDIA',
  DISPLAY = 'DISPLAY',
}

export type Stream = {
  type: StreamTypes;
  mediaStream: MediaStream;
  capabilities?: {
    camera: MediaTrackCapabilities;
    microphone: MediaTrackCapabilities;
  };
  resolutions?: Resolution[];
  settings?: {
    camera: MediaTrackSettings;
    microphone: MediaTrackSettings;
  };
  device?: {
    camera: InputDeviceInfo;
    microphone: InputDeviceInfo;
  };
  state: {
    muteAudio: boolean;
    displayVideo: boolean;
  };
};

const initialStreamState: Stream['state'] = {
  muteAudio: true,
  displayVideo: true,
};

export type StreamId = string;

type StreamsMap = Map<StreamId, Stream>;

enum StreamsActionType {
  ADD_STREAM = 'ADD_STREAM',
  REMOVE_STREAM = 'REMOVE_STREAM',
  RESET = 'RESET',
  TOGGLE_AUDIO = 'TOGGLE_AUDIO',
  TOGGLE_VIDEO = 'TOGGLE_VIDEO',
  APPLY_CONSTRAINS = 'APPLY_CONSTRAINS',
}

type StreamsAction =
  | {
      type: StreamsActionType.RESET;
    }
  | {
      type: StreamsActionType.ADD_STREAM | StreamsActionType.APPLY_CONSTRAINS;
      id: StreamId;
      stream: Stream;
    }
  | {
      type: StreamsActionType.REMOVE_STREAM | StreamsActionType.TOGGLE_AUDIO | StreamsActionType.TOGGLE_VIDEO;
      id: StreamId;
    };

const stopTracks = (stream: MediaStream) => {
  stream.getTracks().forEach((track) => {
    track.stop();
  });
};

const streamsReducer = (state: StreamsMap, action: StreamsAction) => {
  switch (action.type) {
    case StreamsActionType.RESET: {
      [...state].forEach(([, stream]) => {
        stopTracks(stream.mediaStream);
      });
      return new Map<StreamId, Stream>();
    }
    case StreamsActionType.ADD_STREAM: {
      const prev = state.get(action.id);
      if (prev) {
        stopTracks(prev.mediaStream);
      }
      const updated = new Map(state);
      updated.set(action.id, action.stream);
      return updated;
    }
    case StreamsActionType.REMOVE_STREAM: {
      const prev = state.get(action.id);
      const updated = new Map(state);
      if (prev) {
        stopTracks(prev.mediaStream);
      }
      updated.delete(action.id);
      return updated;
    }
    case StreamsActionType.TOGGLE_AUDIO: {
      const prev = state.get(action.id);
      const updated = new Map(state);
      if (prev) {
        const audioTracks = prev.mediaStream.getAudioTracks();
        if (audioTracks && audioTracks.length) {
          audioTracks[0].enabled = !audioTracks[0].enabled;
          updated.set(action.id, {
            ...prev,
            state: {
              ...prev.state,
              muteAudio: !prev.state.muteAudio,
            },
          });
        }
      }
      return updated;
    }
    case StreamsActionType.TOGGLE_VIDEO: {
      const prev = state.get(action.id);
      const updated = new Map(state);
      if (prev) {
        const videoTracks = prev.mediaStream.getVideoTracks();
        if (videoTracks && videoTracks.length) {
          videoTracks[0].enabled = !videoTracks[0].enabled;
          updated.set(action.id, {
            ...prev,
            state: {
              ...prev.state,
              displayVideo: !prev.state.displayVideo,
            },
          });
        }
      }
      return updated;
    }
    case StreamsActionType.APPLY_CONSTRAINS: {
      const updated = new Map(state);
      updated.set(action.id, action.stream);
      return updated;
    }

    default:
      console.error('Unknown action');
      return state;
  }
};

type UseMediaDevicesArguments = {
  handleError?: (error: string) => void;
  filterOutUsedDevices?: boolean;
};

const idealCameraConfig = { width: { ideal: 7680 }, height: { ideal: 4320 }, aspectRatio: 7680 / 4320 };

const isUniqueDevice = (deviceList: InputDeviceInfo[], device: InputDeviceInfo) => {
  return !(device.deviceId === 'default' || deviceList.some((item) => item.deviceId === device.deviceId));
};

type MediaDevicesLists = { cameraList: InputDeviceInfo[]; microphoneList: InputDeviceInfo[] };

const useMediaDevices = ({ handleError, filterOutUsedDevices = true }: UseMediaDevicesArguments = {}): MediaDevices => {
  const [streams, dispatch] = useReducer(streamsReducer, new Map());
  const [rootCameraList, setRootCameraList] = useState<InputDeviceInfo[]>([]);
  const [rootMicrophoneList, setRootMicrophoneList] = useState<InputDeviceInfo[]>([]);
  const [cameraList, setCameraList] = useState<InputDeviceInfo[]>([]);
  const [microphoneList, setMicrophoneList] = useState<InputDeviceInfo[]>([]);

  const _handleError = (error: unknown) => {
    if (error instanceof Error) {
      handleError?.(error.message);
    } else {
      handleError?.(`${error}`);
    }
  };

  const getMediaDevicesLists = async (): Promise<MediaDevicesLists> => {
    const microphoneList: InputDeviceInfo[] = [];
    const cameraList: InputDeviceInfo[] = [];
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      devices.forEach((device) => {
        if (device.kind === 'audioinput' && isUniqueDevice(microphoneList, device)) microphoneList.push(device);
        else if (device.kind === 'videoinput' && isUniqueDevice(cameraList, device)) cameraList.push(device);
      });
      setRootCameraList(cameraList);
      setRootMicrophoneList(microphoneList);
    } catch (error: unknown) {
      _handleError(error);
    }
    return Promise.resolve({ cameraList, microphoneList });
  };

  const addStream: MediaDevices['addStream'] = async ({
    type,
    microphone,
    camera,
    audioConstraints = {},
    videoConstraints = {},
  }) => {
    try {
      if (type === StreamTypes.MEDIA) {
        if (microphone && camera) {
          const constraints = {
            audio: {
              deviceId: { exact: microphone.deviceId },
              ...audioConstraints,
            },
            video: {
              deviceId: { exact: camera.deviceId },
              ...idealCameraConfig,
              ...videoConstraints,
            },
          };
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          const audioTracks = stream.getAudioTracks()[0];
          const videoTracks = stream.getVideoTracks()[0];
          const cameraCapabilities = videoTracks.getCapabilities();
          dispatch({
            type: StreamsActionType.ADD_STREAM,
            id: stream.id,
            stream: {
              type,
              mediaStream: stream,
              capabilities: {
                microphone: audioTracks.getCapabilities(),
                camera: videoTracks.getCapabilities(),
              },
              resolutions: allResolutions.filter((resolution) => {
                return (
                  resolution.width <= (cameraCapabilities?.width?.max ?? 0) &&
                  resolution.height <= (cameraCapabilities?.height?.max ?? 0)
                );
              }),
              settings: {
                microphone: audioTracks.getSettings(),
                camera: videoTracks.getSettings(),
              },
              device: {
                microphone,
                camera,
              },
              state: initialStreamState,
            },
          });
        }
      } else if (type === StreamTypes.DISPLAY) {
        const constraints = {
          video: { cursor: 'always' },
          audio: true,
        } as MediaStreamConstraints;
        const stream = await navigator.mediaDevices.getDisplayMedia(constraints);
        dispatch({
          type: StreamsActionType.ADD_STREAM,
          id: stream.id,
          stream: {
            type,
            mediaStream: stream,
            state: initialStreamState,
          },
        });
      }
    } catch (error: unknown) {
      _handleError(error);
    }
  };

  const initDefaultStream = () => {
    if (microphoneList.length > 0 && cameraList.length > 0) {
      addStream({ type: StreamTypes.MEDIA, microphone: microphoneList[0], camera: cameraList[0] });
    }
  };

  const toggleAudio = (id: StreamId) => {
    dispatch({ type: StreamsActionType.TOGGLE_AUDIO, id });
  };

  const toggleVideo = (id: StreamId) => {
    dispatch({ type: StreamsActionType.TOGGLE_VIDEO, id });
  };

  const removeStream = (id: StreamId) => {
    dispatch({ type: StreamsActionType.REMOVE_STREAM, id });
  };

  const applyConstraints: MediaDevices['applyConstraints'] = async ({
    id,
    audioConstraints = {},
    videoConstraints = {},
  }) => {
    try {
      const prev = streams.get(id);
      if (prev) {
        stopTracks(prev.mediaStream);
        const constraints = {
          audio: {
            ...prev.settings?.microphone,
            ...audioConstraints,
          },
          video: {
            ...prev.settings?.camera,
            ...videoConstraints,
          },
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        const audioTracks = stream.getAudioTracks()[0];
        const videoTracks = stream.getVideoTracks()[0];
        audioTracks.enabled = !prev.state.muteAudio;
        videoTracks.enabled = prev.state.displayVideo;
        dispatch({
          type: StreamsActionType.APPLY_CONSTRAINS,
          id,
          stream: {
            ...prev,
            mediaStream: stream,
            capabilities: {
              microphone: audioTracks.getCapabilities(),
              camera: videoTracks.getCapabilities(),
            },
            settings: {
              microphone: audioTracks.getSettings(),
              camera: videoTracks.getSettings(),
            },
          },
        });
      }
    } catch (error: unknown) {
      _handleError(error);
    }
  };

  const reset = () => {
    dispatch({ type: StreamsActionType.RESET });
  };

  const getDevicesList = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: idealCameraConfig,
      });
      if (stream) {
        stopTracks(stream);
        await getMediaDevicesLists();
      } else {
        _handleError(`Cannot get user's media stream`);
      }
    } catch (error: unknown) {
      _handleError(error);
    }
  };

  useEffect(() => {
    navigator.mediaDevices.addEventListener('devicechange', getDevicesList);
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', getDevicesList);
    };
  }, []);

  useEffect(() => {
    getDevicesList();
    return () => {
      dispatch({ type: StreamsActionType.RESET });
    };
  }, []);

  useEffect(() => {
    if (filterOutUsedDevices && (rootCameraList.length > 0 || rootMicrophoneList.length > 0)) {
      const usedDevices = new Set();
      [...streams].forEach(([, stream]) => {
        usedDevices.add(stream.device?.camera.deviceId);
        usedDevices.add(stream.device?.microphone.deviceId);
      });
      setCameraList(rootCameraList.filter((device) => !usedDevices.has(device.deviceId)));
      setMicrophoneList(rootMicrophoneList.filter((device) => !usedDevices.has(device.deviceId)));
    } else {
      setCameraList(rootCameraList);
      setMicrophoneList(rootMicrophoneList);
    }
  }, [filterOutUsedDevices, streams, rootCameraList, rootMicrophoneList]);

  return {
    cameraList,
    microphoneList,
    streams,
    initDefaultStream,
    addStream,
    toggleAudio,
    toggleVideo,
    reset,
    removeStream,
    applyConstraints,
  };
};

export default useMediaDevices;
