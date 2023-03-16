import { resolutionList } from './constants';
import { CreateStreamOptions, Stream, StreamTypes } from './types';

export const createStream = async ({
  label,
  mediaStream,
  objectUrl,
  type,
}: CreateStreamOptions): Promise<{ id: string; stream: Stream } | undefined> => {
  switch (type) {
    case StreamTypes.DISPLAY:
      if (mediaStream) {
        return {
          id: mediaStream.id,
          stream: {
            label: mediaStream.getVideoTracks()[0].label || label || 'Screenshare',
            mediaStream,
            type,
          } as Stream,
        };
      }

      break;

    case StreamTypes.LOCAL:
      if (objectUrl) {
        return {
          id: objectUrl,
          stream: {
            label: label || 'Local file',
            objectUrl,
            type,
          } as Stream,
        };
      }

      break;

    case StreamTypes.MEDIA:
      if (mediaStream) {
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

  return;
};

export const stopTracks = (stream: MediaStream) => {
  stream.getTracks().forEach((track) => {
    track.stop();
  });
};
