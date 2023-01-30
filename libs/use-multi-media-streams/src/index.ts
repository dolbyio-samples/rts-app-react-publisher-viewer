import { PeerConnection, VideoCodec } from '@millicast/sdk';
import { useState, useEffect, useReducer } from 'react';

import { bitrateList } from './constants';
import reducer from './reducer';
import {
  ApplyConstraintsOptions,
  AddStreamOptions,
  MediaDevices,
  MediaDevicesLists,
  StreamTypes,
  StreamsActionType,
  UseMediaDevicesProps,
  Stream,
} from './types';
import { createStream, idealCameraConfig, isUniqueDevice, stopTracks } from './utils';

const useMediaDevices = ({ filterOutUsedDevices = true, handleError }: UseMediaDevicesProps = {}): MediaDevices => {
  const [streams, dispatch] = useReducer(reducer, new Map());

  const [codecList, setCodecList] = useState<VideoCodec[]>([] as VideoCodec[]);
  const [cameraList, setCameraList] = useState<InputDeviceInfo[]>([]);
  const [microphoneList, setMicrophoneList] = useState<InputDeviceInfo[]>([]);
  const [rootCameraList, setRootCameraList] = useState<InputDeviceInfo[]>([]);
  const [rootMicrophoneList, setRootMicrophoneList] = useState<InputDeviceInfo[]>([]);

  // handle internal list of devices
  useEffect(() => {
    getDevicesList();

    navigator.mediaDevices.addEventListener('devicechange', getDevicesList);

    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', getDevicesList);

      dispatch({ type: StreamsActionType.RESET });
    };
  }, []);

  // handle internal list of codecs
  useEffect(() => {
    const capabilities = PeerConnection.getCapabilities('video');

    const supportedCodecs = capabilities.codecs
      .filter(({ codec }) => codec !== 'av1')
      .sort(({ codec }) => (codec === 'h264' ? -1 : 1))
      .map(({ codec }) => codec);

    setCodecList(supportedCodecs);
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

  const addStream = async (args: AddStreamOptions) => {
    const newStream = await createStream({ bitrate: bitrateList[0].value, codec: codecList[0], ...args });

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

    if (!prevStream) {
      return;
    }

    const { mediaStream } = prevStream;

    const [audioTrack] = mediaStream.getAudioTracks();
    const [videoTrack] = mediaStream.getVideoTracks();

    const applyAudioConstraints = audioTrack.applyConstraints(audioConstraints);
    const applyVideoConstraints = videoTrack.applyConstraints(videoConstraints);

    await Promise.all([applyAudioConstraints, applyVideoConstraints]);

    updateStream(id, {
      capabilities: {
        camera: videoTrack.getCapabilities(),
        microphone: audioTrack.getCapabilities(),
      },
      mediaStream,
      settings: {
        camera: videoTrack.getSettings(),
        microphone: audioTrack.getSettings(),
      },
    });
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
        bitrate: bitrateList[0].value,
        camera: cameraList[0],
        codec: codecList[0],
        label: cameraList[0].label,
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

  const toggleAudio = (id: string) => {
    dispatch({ id, type: StreamsActionType.TOGGLE_AUDIO });
  };

  const toggleVideo = (id: string) => {
    dispatch({ id, type: StreamsActionType.TOGGLE_VIDEO });
  };

  const updateStream = (id: string, stream: Partial<Stream>) => {
    dispatch({ id, stream, type: StreamsActionType.UPDATE_STREAM });
  };

  return {
    addStream,
    applyConstraints,
    cameraList,
    codecList,
    initDefaultStream,
    microphoneList,
    removeStream,
    reset,
    streams,
    toggleAudio,
    toggleVideo,
    updateStream,
  };
};

export * from './constants';
export * from './types';
export default useMediaDevices;
