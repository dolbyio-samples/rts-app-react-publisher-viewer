import { Bitrate, Resolution, Stream } from './types';

export const bitrateList: Bitrate[] = [
  { name: 'Auto', value: 0 },
  { name: '2 Mbps', value: 2_000 },
  { name: '1 Mbps', value: 1_000 },
  { name: '500 Kbps', value: 500 },
  { name: '250 Kbps', value: 250 },
];

export const resolutionList: Resolution[] = [
  {
    height: 2160,
    name: '4K',
    width: 3840,
  },
  {
    height: 1440,
    name: 'QHD',
    width: 2560,
  },
  {
    height: 1080,
    name: 'FHD',
    width: 1920,
  },
  {
    height: 720,
    name: 'HD',
    width: 1280,
  },
  {
    height: 480,
    name: '480p',
    width: 854,
  },
  {
    height: 480,
    name: 'SD',
    width: 640,
  },
  {
    height: 360,
    name: '360p',
    width: 640,
  },
];

export const initialStreamState: Stream['state'] = {
  displayVideo: true,
  muteAudio: true,
};
