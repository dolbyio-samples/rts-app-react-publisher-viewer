import { useMemo } from 'react';
import type { Resolution } from '@millicast-react/resolution-select';

const allResolutions = [
  {
    name: '4K',
    width: 3840,
    height: 2160,
  },
  {
    name: '2K',
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
    width: 852,
    height: 480,
  },
];

const useCameraResolutions: (videoTrackCapabilities?: MediaTrackCapabilities) => Resolution[] = (
  videoTrackCapabilities
) => {
  const supportedCameraResolutions = useMemo<Resolution[]>(() => {
    return allResolutions.filter((resolution) => {
      return (
        resolution.width <= (videoTrackCapabilities?.width?.max ?? 0) &&
        resolution.height <= (videoTrackCapabilities?.height?.max ?? 0)
      );
    });
  }, [videoTrackCapabilities]);

  return supportedCameraResolutions;
};

export default useCameraResolutions;
