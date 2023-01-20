import { MediaLayer, MediaTrackInfo, View, ViewProjectSourceMapping } from '@millicast/sdk';
import { RemoteTrackSource, SimulcastQuality, StreamQuality } from './types';

export const addRemoteTrackAndProject = async (
  viewer: View,
  sourceId: string,
  trackInfo: MediaTrackInfo[]
): Promise<RemoteTrackSource> => {
  const mapping: ViewProjectSourceMapping[] = [];
  const mediaStream = new MediaStream();

  const trackAudio = trackInfo.find(({ media }) => media == 'audio');
  const trackVideo = trackInfo.find(({ media }) => media == 'video');

  let audioMediaId, videoMediaId;

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

  try {
    await viewer.project(sourceId, mapping);

    return Promise.resolve({
      audioMediaId,
      quality: 'Auto',
      mediaStream,
      sourceId,
      statistics: { audio: { inbounds: [], outbounds: [] }, video: { inbounds: [], outbounds: [] } },
      streamQualityOptions: [{ streamQuality: 'Auto' }],
      videoMediaId,
    });
  } catch (error: unknown) {
    return Promise.reject(error);
  }
};

export const buildQualityOptions = (layers: MediaLayer[]) => {
  const qualities: StreamQuality[] = [];

  switch (layers.length) {
    case 2:
      qualities.push('High', 'Low');
      break;

    case 3:
      qualities.push('High', 'Medium', 'Low');
      break;
  }

  const qualityOptions: SimulcastQuality[] = layers.map((layer, idx) => ({
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

export const reprojectToMapping = async (
  viewer: View,
  source: RemoteTrackSource,
  audioMapping?: ViewProjectSourceMapping,
  videoMapping?: ViewProjectSourceMapping
) => {
  const { audioMediaId, sourceId, videoMediaId } = source;

  const mapping: ViewProjectSourceMapping[] = [];

  if (audioMediaId && audioMapping) {
    mapping.push(audioMapping);
  }

  if (videoMediaId && videoMapping) {
    mapping.push(videoMapping);
  }

  // await unprojectRemoteTrackSource(viewer, source);

  try {
    console.log('Reproject remote track to main stream', source);
    await viewer.project(sourceId, mapping);
  } catch (error: unknown) {
    console.error(`Failed to reproject remote track to main stream mapping: ${error}`);
  }
};

export const reprojectToOriginalMapping = async (viewer: View, source: RemoteTrackSource) => {
  const { audioMediaId, sourceId, videoMediaId } = source;

  const mapping: ViewProjectSourceMapping[] = [];

  if (audioMediaId) {
    mapping.push({ media: 'audio', mediaId: audioMediaId, trackId: 'audio' });
  }

  if (videoMediaId) {
    mapping.push({ media: 'video', mediaId: videoMediaId, trackId: 'video' });
  }

  // await unprojectRemoteTrackSource(viewer, source);

  try {
    console.log('reproject remote track to original mapping', source);
    await viewer.project(sourceId, mapping);
  } catch (error: unknown) {
    console.error(`Failed to reproject remote track to original mapping: ${error}`);
  }
};

export const unprojectRemoteTrackSource = async (viewer: View, source: RemoteTrackSource) => {
  const mediaIds = [...(source.audioMediaId ?? []), ...(source.videoMediaId ?? [])];

  if (!mediaIds.length) {
    return;
  }

  try {
    await viewer.unproject(mediaIds);
  } catch (error: unknown) {
    console.error(`Failed to unproject remote track: ${error}`);
  }
};
