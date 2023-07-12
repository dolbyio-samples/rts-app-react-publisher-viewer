import { MediaLayer, MediaTrackInfo, View, ViewProjectSourceMapping } from '@millicast/sdk';
import { RemoteTrackSource, SimulcastQuality, StreamQuality } from './types';

export const DEFAULT_MAIN_SOURCE_ID = 'main-undefined';

export const addRemoteTrack = async (
  viewer: View,
  sourceId: string,
  trackInfo?: MediaTrackInfo[]
): Promise<RemoteTrackSource> => {
  const mediaStream = new MediaStream();

  const trackAudio = trackInfo?.find(({ media }) => media === 'audio');
  const trackVideo = trackInfo?.find(({ media }) => media === 'video');

  let audioMediaId: string | undefined, videoMediaId: string | undefined;
  let audioTrackId: string | undefined, videoTrackId: string | undefined;

  if (trackAudio) {
    const audioTransceiver = await viewer.addRemoteTrack('audio', [mediaStream]);
    audioMediaId = audioTransceiver?.mid ?? undefined;
    audioTrackId = trackAudio.trackId;
  }

  if (trackVideo) {
    const videoTransceiver = await viewer.addRemoteTrack('video', [mediaStream]);
    videoMediaId = videoTransceiver?.mid ?? undefined;
    videoTrackId = trackVideo.trackId;
  }

  return {
    mediaStream,
    quality: 'Auto',
    sourceId,
    audioMediaId,
    audioTrackId,
    videoMediaId,
    videoTrackId,
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
      maxSpatialLayerId: layer.layers[0]?.maxSpatialLayerId,
      maxTemporalLayerId: layer.layers[0]?.maxTemporalLayerId,
    },
    streamQuality: qualities[idx],
  }));
  return [{ streamQuality: 'Auto' } as SimulcastQuality, ...qualityOptions];
};

export const generateProjectMapping = (source: RemoteTrackSource) => {
  const mapping: ViewProjectSourceMapping[] = [];
  if (source.audioMediaId) {
    mapping.push({ media: 'audio', trackId: source.audioTrackId, mediaId: source.audioMediaId });
  }
  if (source.videoMediaId) {
    mapping.push({ media: 'video', trackId: source.videoTrackId, mediaId: source.videoMediaId });
  }
  return mapping;
};

export const unprojectFromStream = async (viewer: View, source: RemoteTrackSource) => {
  const mediaIds = [];
  if (source.audioMediaId) mediaIds.push(source.audioMediaId);
  if (source.videoMediaId) mediaIds.push(source.videoMediaId);
  if (mediaIds.length) {
    await viewer.unproject(mediaIds);
  }
};

// project the tracks in source to media stream which has specified audio MID and video MID
// if the media stream which is bind to the audio MID and video MID is unavailable, it will
// fail to project
export const projectToStream = async (
  viewer: View,
  source: RemoteTrackSource,
  audioMID?: string,
  videoMID?: string
) => {
  const mapping: ViewProjectSourceMapping[] = [];
  const audioTrackId = source.audioTrackId;
  if (audioMID && audioTrackId) {
    mapping.push({ media: 'audio', trackId: audioTrackId, mediaId: audioMID } as ViewProjectSourceMapping);
  }
  const videoTrackId = source.videoTrackId;
  if (videoMID && videoTrackId) {
    mapping.push({ media: 'video', trackId: videoTrackId, mediaId: videoMID } as ViewProjectSourceMapping);
  }
  await viewer.project(source.sourceId === DEFAULT_MAIN_SOURCE_ID ? undefined : source.sourceId, mapping);
};

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
