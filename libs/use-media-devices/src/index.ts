import { idealCameraConfig } from './constants';
import { StartDeviceProps, useMediaDevicesProps } from './types';
import { isUniqueDevice } from './utils';
import { useState, useEffect, useMemo } from 'react';

/**
 * This hook manages all currently available media devices such as cameras and microphones. A list of connected
 * and usable audio/video devices can be read. The user can start or stop the real-time capture of any valid media
 * device's content. All currently active mediastreams are subsequently stored in state and can be read.
 */
const useMediaDevices = ({ filterUsedDevices = true, handleError }: useMediaDevicesProps = {}) => {
  const [audioDevices, setAudioDevices] = useState<InputDeviceInfo[]>([]);
  const [mediaStreams, setMediaStreams] = useState<MediaStream[]>([]);
  const [rootAudioDevices, setRootAudioDevices] = useState<InputDeviceInfo[]>([]);
  const [rootVideoDevices, setRootVideoDevices] = useState<InputDeviceInfo[]>([]);
  const [videoDevices, setVideoDevices] = useState<InputDeviceInfo[]>([]);

  // Handle internal list of devices
  useEffect(() => {
    (async () => {
      const audioDeviceList: InputDeviceInfo[] = [];
      const videoDeviceList: InputDeviceInfo[] = [];

      try {
        await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        const devices = await navigator.mediaDevices.enumerateDevices();

        devices.forEach((device) => {
          if (device.kind === 'audioinput' && isUniqueDevice(audioDeviceList, device)) {
            audioDeviceList.push(device);
          } else if (device.kind === 'videoinput' && isUniqueDevice(videoDeviceList, device)) {
            videoDeviceList.push(device);
          }
        });

        setRootAudioDevices(audioDeviceList);
        setRootVideoDevices(videoDeviceList);
      } catch (error: unknown) {
        handleInternalError(error);
      }
    })();
  }, []);

  // Filter out devices that are in use
  useEffect(() => {
    if (filterUsedDevices) {
      setAudioDevices(rootAudioDevices.filter(({ deviceId }) => !devicesInUse.has(deviceId)));
      setVideoDevices(rootVideoDevices.filter(({ deviceId }) => !devicesInUse.has(deviceId)));
    } else {
      setAudioDevices(rootAudioDevices);
      setVideoDevices(rootVideoDevices);
    }
  }, [filterUsedDevices, mediaStreams, rootAudioDevices, rootVideoDevices]);

  const devicesInUse = useMemo(
    () =>
      new Set(
        mediaStreams.flatMap((mediaStream) => mediaStream.getTracks()).map((track) => track.getSettings().deviceId)
      ),
    [mediaStreams]
  );

  const handleInternalError = (error: unknown) => {
    if (error instanceof Error) {
      handleError?.(error.message);
    } else {
      handleError?.(`${error}`);
    }
  };

  const start = async ({ audioConstraints, audioDeviceId, videoConstraints, videoDeviceId }: StartDeviceProps) => {
    if (!audioDeviceId && !videoDeviceId) {
      return;
    }

    if (audioDeviceId) {
      if (!audioDevices.find(({ deviceId }) => deviceId === audioDeviceId)) {
        handleInternalError('Audio device could not be found');
        return;
      }

      if (devicesInUse.has(audioDeviceId)) {
        handleInternalError('Audio device is already in use');
        return;
      }
    }

    if (videoDeviceId) {
      if (!videoDevices.find(({ deviceId }) => deviceId === videoDeviceId)) {
        handleInternalError('Video device could not be found');
        return;
      }

      if (devicesInUse.has(videoDeviceId)) {
        handleInternalError('Video device is already in use');
        return;
      }
    }

    const constraints = {
      audio: {
        deviceId: { exact: audioDeviceId },
        ...audioConstraints,
      },
      video: {
        deviceId: { exact: videoDeviceId },
        ...idealCameraConfig,
        ...videoConstraints,
      },
    };

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);

      setMediaStreams((prevMediaStreams) => [...prevMediaStreams, mediaStream]);
    } catch (error: unknown) {
      handleInternalError(error);
    }
  };

  const stop = (mediaStreamId: string) => {
    const mediaStream = mediaStreams.find(({ id }) => id === mediaStreamId);

    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => {
        track.stop();
      });

      setMediaStreams((prevMediaStreams) => prevMediaStreams.filter(({ id }) => id !== mediaStreamId));
    }
  };

  return {
    audioDevices,
    mediaStreams,
    start,
    stop,
    videoDevices,
  };
};

export * from './constants';
export * from './types';
export default useMediaDevices;
