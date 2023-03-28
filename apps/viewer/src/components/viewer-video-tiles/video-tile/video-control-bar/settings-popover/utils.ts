import { SimulcastQuality } from '@millicast-react/use-viewer';

export const qualityElementResolver = (element: unknown) => {
  const quality = element as SimulcastQuality;

  return {
    data: quality,
    id: quality.streamQuality,
    label: quality.streamQuality,
  };
};
