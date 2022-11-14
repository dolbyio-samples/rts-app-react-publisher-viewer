import { useEffect, useState } from 'react';
import useMediaDevices from '@millicast-react/use-media-devices';
import { Resolution } from '@millicast-react/resolution-select';

type cameraResolutions = {
  supportedResolutionList: Resolution[];
};

const useCameraResolutions: () => cameraResolutions = () => {
  const { supportedVideoTrackCapabilities } = useMediaDevices();
  const [supportedResolutionList, setSupportedResolutionList] = useState<Resolution[]>([]);

  useEffect(() => {
    if (supportedVideoTrackCapabilities) {
      const tempSupportedResolutionList = [];
      if (
        supportedVideoTrackCapabilities.width &&
        supportedVideoTrackCapabilities.width.max &&
        supportedVideoTrackCapabilities.height &&
        supportedVideoTrackCapabilities.height.max
      ) {
        if (supportedVideoTrackCapabilities.width.max >= 3840 && supportedVideoTrackCapabilities.height.max >= 2160) {
          tempSupportedResolutionList.push({
            name: '2160p',
            width: 3840,
            height: 2160,
          });
        }
        if (supportedVideoTrackCapabilities.width.max >= 2560 && supportedVideoTrackCapabilities.height.max >= 1440) {
          tempSupportedResolutionList.push({
            name: '1440p',
            width: 2560,
            height: 1440,
          });
        }
        if (supportedVideoTrackCapabilities.width.max >= 1920 && supportedVideoTrackCapabilities.height.max >= 1080) {
          tempSupportedResolutionList.push({
            name: '1080p',
            width: 1920,
            height: 1080,
          });
        }
        if (supportedVideoTrackCapabilities.width.max >= 1280 && supportedVideoTrackCapabilities.height.max >= 720) {
          tempSupportedResolutionList.push({
            name: '720p',
            width: 1280,
            height: 720,
          });
        }
        if (supportedVideoTrackCapabilities.width.max >= 720 && supportedVideoTrackCapabilities.height.max >= 480) {
          tempSupportedResolutionList.push({
            name: '480p',
            width: 720,
            height: 480,
          });
        }
      }

      if (tempSupportedResolutionList.length !== 0) {
        setSupportedResolutionList(tempSupportedResolutionList);
      }
    }
  }, [supportedVideoTrackCapabilities]);

  return { supportedResolutionList };
};

export default useCameraResolutions;
