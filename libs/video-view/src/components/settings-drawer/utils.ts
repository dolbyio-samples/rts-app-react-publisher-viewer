import { VideoCodec } from '@millicast/sdk';

import { Resolution } from '@millicast-react/use-multi-media-devices';
import { Bitrate } from '@millicast-react/use-publisher';
import { SimulcastQuality } from '@millicast-react/use-viewer';

export const bitrateElementResolver = (element: unknown) => {
  const bitrateElement = element as Bitrate;
  return {
    data: bitrateElement.value,
    id: bitrateElement.name,
    label: bitrateElement.name,
  };
};

export const codecElementResolver = (element: unknown) => ({
  data: element as VideoCodec,
  id: element as string,
  label: element as string,
});

export const deviceElementResolver = (element: unknown) => {
  const deviceElement = element as InputDeviceInfo;
  return {
    data: deviceElement,
    id: deviceElement.deviceId,
    label: deviceElement.label,
  };
};

export const qualityElementResolver = (element: unknown) => {
  const quality = element as SimulcastQuality;
  return {
    data: quality,
    id: quality.streamQuality,
    label: quality.streamQuality,
  };
};

export const resolutionElementResolver = (element: unknown) => {
  const resolution = element as Resolution;
  return {
    data: resolution,
    id: `${resolution.width}x${resolution.height}`,
    label: `${resolution.width}x${resolution.height}`,
  };
};
