import { useState, useEffect, useReducer } from 'react';

import reducer from './reducer';
import {
  ApplyConstraintsOptions,
  CreateStreamOptions,
  MediaDevices,
  MediaDevicesLists,
  StreamId,
  StreamTypes,
  StreamsActionType,
  UseMediaDevicesArguments,
} from './types';
import { createStream, idealCameraConfig, isUniqueDevice, stopTracks } from './utils';

const useMediaDevices = ({ handleError, filterOutUsedDevices = true }: UseMediaDevicesArguments = {}): MediaDevices => {
  const [streams, dispatch] = useReducer(reducer, new Map());

  const [rootCameraList, setRootCameraList] = useState<InputDeviceInfo[]>([]);
  const [rootMicrophoneList, setRootMicrophoneList] = useState<InputDeviceInfo[]>([]);
  const [cameraList, setCameraList] = useState<InputDeviceInfo[]>([]);
  const [microphoneList, setMicrophoneList] = useState<InputDeviceInfo[]>([]);

  useEffect(() => {
    getDevicesList();

    return () => {
      dispatch({ type: StreamsActionType.RESET });
    };
  }, []);

  useEffect(() => {
    navigator.mediaDevices.addEventListener('devicechange', getDevicesList);
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', getDevicesList);
    };
  }, []);

  useEffect(() => {
    if (filterOutUsedDevices && (rootCameraList.length || rootMicrophoneList.length)) {
      const usedDevices = new Set();

      streams.forEach((stream) => {
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

  const addStream = async (args: CreateStreamOptions) => {
    const newStream = await createStream(args);

    if (newStream) {
      dispatch({
        type: StreamsActionType.ADD_STREAM,
        ...newStream,
      });
    }
  };

  const applyConstraints = async ({ audioConstraints = {}, id, videoConstraints = {} }: ApplyConstraintsOptions) => {
    const prevStream = streams.get(id);

    if (prevStream) {
      const newConstraints = {
        audio: {
          ...prevStream.settings?.microphone,
          ...audioConstraints,
        },
        video: {
          ...prevStream.settings?.camera,
          ...videoConstraints,
        },
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(newConstraints);

      dispatch({ id, mediaStream, type: StreamsActionType.APPLY_CONSTRAINTS });
    }
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
        handleInternalError(`Cannot get user's media stream`);
      }
    } catch (error: unknown) {
      handleInternalError(error);
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
      handleInternalError(error);
    }
    return Promise.resolve({ cameraList, microphoneList });
  };

  const handleInternalError = (error: unknown) => {
    if (error instanceof Error) {
      handleError?.(error.message);
    } else {
      handleError?.(`${error}`);
    }
  };

  const initDefaultStream = () => {
    if (microphoneList.length > 0 && cameraList.length > 0) {
      addStream({ camera: cameraList[0], microphone: microphoneList[0], type: StreamTypes.MEDIA });
    }
  };

  const removeStream = (id: StreamId) => {
    dispatch({ id, type: StreamsActionType.REMOVE_STREAM });
  };

  const reset = () => {
    dispatch({ type: StreamsActionType.RESET });
  };

  const toggleAudio = (id: StreamId) => {
    dispatch({ id, type: StreamsActionType.TOGGLE_AUDIO });
  };

  const toggleVideo = (id: StreamId) => {
    dispatch({ id, type: StreamsActionType.TOGGLE_VIDEO });
  };

  return {
    addStream,
    applyConstraints,
    cameraList,
    initDefaultStream,
    microphoneList,
    removeStream,
    reset,
    streams,
    toggleAudio,
    toggleVideo,
  };
};

export * from './types';
export default useMediaDevices;
