import React, { useState, memo } from 'react';
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

type Resolutions = '2160p' | '1080p' | '720p' | '480p';

const ResolutionSelect = ({ onSelectResolution, supportedResolutions, defaultResolution }: ResolutionSelectProps) => {
  // const [resolution, setResolution] = useState<Resolutions>('720p');

  const onResolutionChange = (selectedResolution: Resolutions) => {

    supportedResolutions.forEach(resolution => {
      if (resolution.name === selectedResolution) {
        onSelectResolution(resolution);
      }
    })
    // All resolutions follow its own aspect ratio
    // switch (selectedResolution) {
    //   case '1080p':
    //     onSelectResolution({ name: '1080p', width: 1920, height: 1080 });
    //     break;
    //   case '720p':
    //     onSelectResolution({ name: '720p', width: 1280, height: 720 });
    //     break;
    //   case '480p':
    //     onSelectResolution({ name: '480p', width: 720, height: 480 });
    //     break;
    //   case '2160p':
    //     onSelectResolution({ name: '2160p', width: 3840, height: 2160 });
    //     break;
    // }
    // setResolution(selectedResolution);
  };

  return (
    <Select
      test-id="resolutionSelect"
      defaultValue={defaultResolution.name}
      onChange={(event) => onResolutionChange(event.target.value as Resolutions)}
    >
      {supportedResolutions.map(resolution => <option key={resolution.name} value={resolution.name}>{resolution.name}</option>)}
      {/* <option value="2160p">2160p</option>
      <option value="1080p">1080p</option>
      <option value="720p">720p</option>
      <option value="480p">480p</option> */}
    </Select>
  );
};

export default memo(ResolutionSelect);
