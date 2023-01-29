import { Resolution, Stream } from './types';

export const allResolutions: Resolution[] = [
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
