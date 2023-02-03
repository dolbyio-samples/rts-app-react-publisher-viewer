import { useState, useEffect, useReducer } from 'react';

import { idealCameraConfig } from './constants';
import reducer from './reducer';
import {
  ApplyConstraintsOptions,
  CreateStreamOptions,
  MediaDevices,
  MediaDevicesLists,
  Stream,
  StreamTypes,
  StreamsActionType,
  UseMediaDevicesProps,
} from './types';
import { createStream, isUniqueDevice, stopTracks } from './utils';

const useMediaDevices = ({ filterOutUsedDevices = true, handleError }: UseMediaDevicesProps = {}): MediaDevices => {
  const [streams, dispatch] = useReducer(reducer, new Map());

  const [cameraList, setCameraList] = useState<InputDeviceInfo[]>([]);
  const [microphoneList, setMicrophoneList] = useState<InputDeviceInfo[]>([]);
  const [rootCameraList, setRootCameraList] = useState<InputDeviceInfo[]>([]);
  const [rootMicrophoneList, setRootMicrophoneList] = useState<InputDeviceInfo[]>([]);

  // Handle internal list of devices
  useEffect(() => {
    getDevicesList();

    navigator.mediaDevices.addEventListener('devicechange', getDevicesList);

    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', getDevicesList);

      dispatch({ type: StreamsActionType.RESET });
    };
  }, []);

  useEffect(() => {
    if (filterOutUsedDevices && (rootCameraList.length || rootMicrophoneList.length)) {
      const usedDevices = new Set();

      streams.forEach(({ mediaStream, type }) => {
        if (mediaStream && type === StreamTypes.MEDIA) {
          const [audioTrack] = mediaStream.getAudioTracks();
          const [videoTrack] = mediaStream.getVideoTracks();

          const { deviceId: audioDeviceId } = audioTrack.getCapabilities();
          const { deviceId: videoDeviceId } = videoTrack.getCapabilities();

          usedDevices.add(audioDeviceId);
          usedDevices.add(videoDeviceId);
        }
      });

      setCameraList(rootCameraList.filter((device) => !usedDevices.has(device.deviceId)));
      setMicrophoneList(rootMicrophoneList.filter((device) => !usedDevices.has(device.deviceId)));
    } else {
      setCameraList(rootCameraList);
      setMicrophoneList(rootMicrophoneList);
    }
  }, [filterOutUsedDevices, streams, rootCameraList, rootMicrophoneList]);

  const addStream = async (options: CreateStreamOptions) => {
    const newStream = await createStream(options);

    if (newStream) {
      dispatch({
        type: StreamsActionType.ADD_STREAM,
        ...newStream,
      });
    }
  };

  const applyConstraints = async (
    id: string,
    { audioConstraints = {}, videoConstraints = {} }: ApplyConstraintsOptions
  ) => {
    const prevStream = streams.get(id);

    if (prevStream?.mediaStream) {
      const { mediaStream } = prevStream;

      const [audioTrack] = mediaStream.getAudioTracks();
      const [videoTrack] = mediaStream.getVideoTracks();

      const applyAudioConstraints = audioTrack.applyConstraints(audioConstraints);
      const applyVideoConstraints = videoTrack.applyConstraints(videoConstraints);

      await Promise.all([applyAudioConstraints, applyVideoConstraints]);

      updateStream(id, { mediaStream });
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
    if (microphoneList.length && cameraList.length) {
      addStream({
        camera: cameraList[0],
        microphone: microphoneList[0],
        type: StreamTypes.MEDIA,
      });
    }
  };

  const removeStream = (id: string) => {
    dispatch({ id, type: StreamsActionType.REMOVE_STREAM });
  };

  const reset = () => {
    dispatch({ type: StreamsActionType.RESET });
  };

  const updateStream = (id: string, stream: Partial<Stream>) => {
    dispatch({ id, stream, type: StreamsActionType.UPDATE_STREAM });
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
    updateStream,
  };
};

export * from './constants';
export * from './types';
export default useMediaDevices;
