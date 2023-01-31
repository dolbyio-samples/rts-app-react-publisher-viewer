import { useMemo } from 'react';

export interface Resolution {
  name?: string;
  width: number;
  height: number;
}

const allResolutions: Resolution[] = [
  {
    name: '4K',
    width: 3840,
    height: 2160,
  },
  {
    name: 'QHD',
    width: 2560,
    height: 1440,
  },
  {
    name: 'FHD',
    width: 1920,
    height: 1080,
  },
  {
    name: 'HD',
    width: 1280,
    height: 720,
  },
  {
    name: '480p',
    width: 854,
    height: 480,
  },
  {
    name: 'SD',
    width: 640,
    height: 480,
  },
  {
    name: '360p',
    width: 640,
    height: 360,
  },
];

// TODO: add more helper functions to this hook
const useCameraCapabilities: (cameraCapabilities?: MediaTrackCapabilities) => Resolution[] = (cameraCapabilities) => {
  const supportedResolutions = useMemo<Resolution[]>(() => {
    return allResolutions.filter((resolution) => {
      return (
        resolution.width <= (cameraCapabilities?.width?.max ?? 0) &&
        resolution.height <= (cameraCapabilities?.height?.max ?? 0)
      );
    });
  }, [cameraCapabilities]);

  return supportedResolutions;
};

export default useCameraCapabilities;
