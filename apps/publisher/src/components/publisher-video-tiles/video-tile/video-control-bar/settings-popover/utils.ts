import { VideoCodec } from '@millicast/sdk';

import { Bitrate } from '@millicast-react/use-publisher';
import { Resolution } from 'apps/publisher/src/hooks/use-multi-media-streams';

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

export const resolutionElementResolver = (element: unknown) => {
  const resolution = element as Resolution;
  return {
    data: resolution,
    id: `${resolution.width}x${resolution.height}`,
    label: `${resolution.width}x${resolution.height}`,
  };
};
