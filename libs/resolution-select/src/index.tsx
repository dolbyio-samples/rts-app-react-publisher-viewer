import React, { memo } from 'react';
import { Select } from '@chakra-ui/react';

type ResolutionSelectProps = {
  onSelectResolution: (resolution: Resolution) => void;
  supportedResolutions: Resolution[];
  defaultResolution: Resolution;
};

export type Resolution = {
  name: string;
  width: number;
  height: number;
};

type Resolutions = '2160p' | '1440p' | '1080p' | '720p' | '480p';

const ResolutionSelect = ({ onSelectResolution, supportedResolutions, defaultResolution }: ResolutionSelectProps) => {
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
