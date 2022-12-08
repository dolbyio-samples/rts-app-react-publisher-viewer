import { MediaLayer, MediaTrackInfo, View, ViewProjectSourceMapping } from '@millicast/sdk';
import { RemoteTrackSource, SimulcastQuality, StreamQuality } from './types';

export const addRemoteTrackAndProject = async (
  sourceId: string,
  trackInfos: MediaTrackInfo[],
  viewer: View
): Promise<RemoteTrackSource> => {
  let videoTransceiver: RTCRtpTransceiver | undefined;
  let audioTransceiver: RTCRtpTransceiver | undefined;
  const mediaStream = new MediaStream();
  const mapping: ViewProjectSourceMapping[] = [];
  const trackSource: RemoteTrackSource = {
    mediaStream,
    sourceId,
    statistics: { audio: [], video: [] },
    streamQualityOptions: [{ streamQuality: 'Auto' }],
  };
  console.log({ trackInfos });
  let trackInfo = trackInfos.find((info) => info.media == 'video');
  if (trackInfo) {
    videoTransceiver = await viewer.addRemoteTrack('video', [mediaStream]);
    const videoMid = videoTransceiver?.mid ?? undefined;
    if (videoMid) {
      mapping.push({ trackId: trackInfo.trackId, mediaId: videoMid, media: trackInfo.media });
      trackSource.videoMediaId = videoMid;
    }
  }
  trackInfo = trackInfos.find((info) => info.media == 'audio');
  if (trackInfo) {
    audioTransceiver = await viewer.addRemoteTrack('audio', [mediaStream]);
    console.log({ audioTransceiver });
    const audioMid = audioTransceiver?.mid ?? undefined;
    if (audioMid) {
      mapping.push({ trackId: trackInfo.trackId, mediaId: audioMid, media: trackInfo.media });
      trackSource.audioMediaId = audioMid;
    }
  }
  if (mapping.length === 0) {
    return Promise.reject('No valid video or audio track');
  }
  try {
    await viewer.project(sourceId, mapping);
    return Promise.resolve(trackSource);
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
    default:
      return [{ streamQuality: 'Auto' } as SimulcastQuality];
  }
  console.log('buildQualityOptions');
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
  return qualityOptions;
};

export const unprojectAndRemoveRemoteTrack = async (source: RemoteTrackSource, viewer: View) => {
  const mids = [];
  if (source.videoMediaId) mids.push(source.videoMediaId);
  if (source.audioMediaId) mids.push(source.audioMediaId);
  if (mids.length === 0) return;
  try {
    console.log('unproject remote track', source);
    await viewer.unproject(mids);
  } catch (error: unknown) {
    console.error(`Failed to unproject remote track: ${error}`);
  }
};
