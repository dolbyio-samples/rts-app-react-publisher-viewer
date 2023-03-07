import { MediaLayer, MediaTrackInfo, View, ViewProjectSourceMapping } from '@millicast/sdk';
import { RemoteTrackSource, SimulcastQuality, StreamQuality } from './types';

export const addRemoteTrack = async (
  viewer: View,
  sourceId?: string,
  trackInfo?: MediaTrackInfo[]
): Promise<RemoteTrackSource> => {
  const mapping: ViewProjectSourceMapping[] = [];
  const mediaStream = new MediaStream();

  const trackAudio = trackInfo?.find(({ media }) => media == 'audio');
  const trackVideo = trackInfo?.find(({ media }) => media == 'video');

  let audioMediaId: string | undefined, videoMediaId: string | undefined;

  if (trackAudio) {
    const audioTransceiver = await viewer.addRemoteTrack('audio', [mediaStream]);
    audioMediaId = audioTransceiver?.mid ?? undefined;

    if (audioMediaId) {
      mapping.push({ media: 'audio', mediaId: audioMediaId, trackId: 'audio' });
    }
  }

  if (trackVideo) {
    const videoTransceiver = await viewer.addRemoteTrack('video', [mediaStream]);
    videoMediaId = videoTransceiver?.mid ?? undefined;

    if (videoMediaId) {
      mapping.push({ media: 'video', mediaId: videoMediaId, trackId: 'video' });
    }
  }

  return {
    audioMediaId,
    mediaStream,
    projectMapping: mapping,
    quality: 'Auto',
    sourceId,
    videoMediaId,
  };
};

export const buildQualityOptions = (layers: MediaLayer[] = []) => {
  const qualities: StreamQuality[] = [];

  switch (layers.length) {
    case 2:
      qualities.push('High', 'Low');
      break;

    case 3:
      qualities.push('High', 'Medium', 'Low');
      break;

    default:
      // Exit with only the auto layer
      return [{ streamQuality: 'Auto' } as SimulcastQuality];
  }

  const descendingLayers = layers.sort((a, b) => b.bitrate - a.bitrate);

  const qualityOptions: SimulcastQuality[] = descendingLayers.map((layer, idx) => ({
    simulcastLayer: {
      bitrate: layer.bitrate,
      encodingId: layer.id,
      simulcastIdx: layer.simulcastIdx,
      spatialLayerId: layer.layers[0]?.spatialLayerId, // H264 doesn't have layers.
      temporalLayerId: layer.layers[0]?.temporalLayerId, // H264 doesn't have layers.
    },
    streamQuality: qualities[idx],
  }));

  return [{ streamQuality: 'Auto' } as SimulcastQuality, ...qualityOptions];
};

export const unprojectFromStream = async (viewer: View, source: RemoteTrackSource) => {
  const mediaIds = [];
  if (source.audioMediaId) mediaIds.push(source.audioMediaId);
  if (source.videoMediaId) mediaIds.push(source.videoMediaId);
  if (mediaIds.length) {
    await viewer.unproject(mediaIds);
  }
};

export const projectToStream = async (
  viewer: View,
  source: RemoteTrackSource,
  audioMapping?: ViewProjectSourceMapping,
  videoMapping?: ViewProjectSourceMapping
) => {
  const mapping: ViewProjectSourceMapping[] = [];

  if (audioMapping) {
    mapping.push(audioMapping);
  }

  if (videoMapping) {
    mapping.push(videoMapping);
  }

  await viewer.project(source.sourceId, mapping);
};
