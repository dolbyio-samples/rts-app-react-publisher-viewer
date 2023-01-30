import { initialStreamState, resolutionList } from './constants';
import { CreateStreamOptions, HTMLVideoElementWithCaptureStream, Stream, StreamTypes } from './types';

export const createStream = async ({
  audioConstraints = {},
  bitrate,
  camera,
  codec,
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
          bitrate,
          codec,
          // TODO: better display screen label
          label: label ?? mediaStream.getVideoTracks()[0].label ?? mediaStream.id,
          mediaStream,
          simulcast: codec === 'h264',
          state: initialStreamState,
          type,
        },
      };
    }

    case StreamTypes.LOCAL: {
      if (!objectUrl) {
        return;
      }

      // Custom type as captureStream is not defined in HTMLVideoElement by default
      const video = document.createElement('video') as HTMLVideoElementWithCaptureStream;
      video.loop = true;
      video.src = objectUrl;

      const mediaStream = video.captureStream();

      await video.play();

      return {
        id: mediaStream.id,
        stream: {
          bitrate,
          codec,
          label: label ?? mediaStream.id,
          mediaStream,
          simulcast: codec === 'h264',
          state: initialStreamState,
          type,
        },
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

      const audioTracks = mediaStream.getAudioTracks()[0];
      const videoTracks = mediaStream.getVideoTracks()[0];

      const cameraCapabilities = videoTracks.getCapabilities();

      const resolutions = resolutionList.filter(
        (resolution) =>
          resolution.height <= (cameraCapabilities?.height?.max ?? 0) &&
          resolution.width <= (cameraCapabilities?.width?.max ?? 0)
      );

      const stream = {
        bitrate,
        capabilities: {
          camera: videoTracks.getCapabilities(),
          microphone: audioTracks.getCapabilities(),
        },
        codec,
        device: {
          camera,
          microphone,
        },
        label: label ?? mediaStream.id,
        mediaStream,
        resolutions,
        settings: {
          camera: videoTracks.getSettings(),
          microphone: audioTracks.getSettings(),
        },
        simulcast: codec === 'h264',
        state: initialStreamState,
        type,
      };

      return {
        id: mediaStream.id,
        stream,
      };
    }
  }
};

export const idealCameraConfig = { aspectRatio: 7680 / 4320, height: { ideal: 4320 }, width: { ideal: 7680 } };

export const isUniqueDevice = (deviceList: InputDeviceInfo[], device: InputDeviceInfo) => {
  return !(device.deviceId === 'default' || deviceList.some((item) => item.deviceId === device.deviceId));
};

export const stopTracks = (stream: MediaStream) => {
  stream.getTracks().forEach((track) => {
    track.stop();
  });
};
