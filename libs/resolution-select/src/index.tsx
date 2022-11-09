import React, { memo } from 'react';
import { Select } from '@chakra-ui/react';

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

const ResolutionSelect = ({
  onSelectResolution,
  resolutionList: supportedResolutions,
  defaultResolution,
}: ResolutionSelectProps) => {
  return (
    <Select
      test-id="resolutionSelect"
      defaultValue={0}
      onChange={(event) => onSelectResolution(supportedResolutions[Number(event.target.value)])}
    >
      {supportedResolutions.map((resolution, idx) => (
        <option key={idx} value={idx}>
          {resolution.name}
        </option>
      ))}
    </Select>
  );
};

export default memo(ResolutionSelect);
