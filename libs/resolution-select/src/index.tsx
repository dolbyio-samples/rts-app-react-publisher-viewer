import React, { memo } from 'react';
import { Select } from '@chakra-ui/react';

import type { Resolutions } from '../../../apps/publisher/src/app'

type ResolutionSelectProps = {
  onSelectResolution: (resolution: Resolution) => void;
  resolutionList: Resolution[];
  defaultResolution: Resolution;
};

export type Resolution = {
  name: string;
  width: number;
  height: number;
};

const ResolutionSelect = ({ onSelectResolution, resolutionList: supportedResolutions, defaultResolution }: ResolutionSelectProps) => {
  const onResolutionChange = (selectedResolution: Resolutions) => {
    supportedResolutions.forEach((resolution) => {
      if (resolution.name === selectedResolution) {
        onSelectResolution(resolution);
      }
    });
  };

  return (
    <Select
      test-id="resolutionSelect"
      defaultValue={defaultResolution.name}
      onChange={(event) => onResolutionChange(event.target.value as Resolutions)}
    >
      {supportedResolutions.map((resolution) => (
        <option key={resolution.name} value={resolution.name}>
          {resolution.name}
        </option>
      ))}
    </Select>
  );
};

export default memo(ResolutionSelect);
