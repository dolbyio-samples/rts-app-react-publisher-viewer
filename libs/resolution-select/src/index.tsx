import React, { memo } from 'react';
import { Select } from '@chakra-ui/react';

type ResolutionSelectProps = {
  onSelectResolution: (resolution: Resolution) => void;
  resolutionList: Resolution[];
  currentHeight?: number;
};

export type Resolution = {
  width: number;
  height: number;
};

const ResolutionSelect = ({ onSelectResolution, resolutionList, currentHeight }: ResolutionSelectProps) => {
  const currentValue = currentHeight
    ? resolutionList.findIndex((resolution) => {
        return resolution.height === currentHeight;
      })
    : 0;
  return (
    <Select
      test-id="resolutionSelect"
      value={currentValue < 0 ? 0 : currentValue}
      onChange={(event) => onSelectResolution(resolutionList[Number(event.target.value)])}
    >
      {resolutionList.map((resolution, idx) => (
        <option key={idx} value={idx}>
          {`${resolution.width}x${resolution.height}`}
        </option>
      ))}
    </Select>
  );
};

export default memo(ResolutionSelect);
