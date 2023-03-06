import { idealCameraConfig, resolutionList } from './constants';
import { CreateStreamOptions, Stream, StreamTypes } from './types';

export const createStream = async ({
  audioConstraints = {},
  camera,
  label,
  microphone,
  objectUrl,
  type,
  videoConstraints = {},
}: CreateStreamOptions): Promise<{ id: string; stream: Stream } | undefined> => {
  switch (type) {
    case StreamTypes.DISPLAY: {
      const constraints = {
        audio: true,
        video: { cursor: 'always' },
      } as MediaStreamConstraints;

      const mediaStream = await navigator.mediaDevices.getDisplayMedia(constraints);

      return {
        id: mediaStream.id,
        stream: {
          label: mediaStream.getVideoTracks()[0].label || 'Screenshare',
          mediaStream,
          type,
        } as Stream,
      };
    }

    case StreamTypes.LOCAL: {
      if (!objectUrl) {
        return;
      }

      return {
        id: objectUrl,
        stream: {
          label: label || 'Local file',
          objectUrl,
          type,
        } as Stream,
      };
    }

    case StreamTypes.MEDIA: {
      if (!camera || !microphone) {
        return;
      }

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

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);

      const [videoTrack] = mediaStream.getVideoTracks();

      const cameraCapabilities = videoTrack.getCapabilities();

      const resolutions = resolutionList.filter(
        (resolution) =>
          resolution.height <= (cameraCapabilities?.height?.max ?? 0) &&
          resolution.width <= (cameraCapabilities?.width?.max ?? 0)
      );

      return {
        id: mediaStream.id,
        stream: {
          label: videoTrack.label || 'Media device',
          mediaStream,
          resolutions,
          type,
        } as Stream,
      };
    }
  }
};

export const isUniqueDevice = (deviceList: InputDeviceInfo[], device: InputDeviceInfo) => {
  return !(device.deviceId === 'default' || deviceList.some((item) => item.deviceId === device.deviceId));
};

export const stopTracks = (stream: MediaStream) => {
  stream.getTracks().forEach((track) => {
    track.stop();
  });
};
