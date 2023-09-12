import { Box } from '@chakra-ui/react';
import React from 'react';

import { IconCameraOn, IconSettings, Sliders } from '@millicast-react/dolbyio-icons';
import Dropdown, { Element } from '@millicast-react/dropdown';
import Popover from '@millicast-react/popover';

import { SettingsPopoverProps } from './types';
import { qualityElementResolver } from './utils';

const SettingsPopover = ({ iconProps, quality, sources }: SettingsPopoverProps = {}) => (
  <Popover
    heading="Stream settings"
    icon={<IconSettings fill="white" />}
    iconProps={iconProps}
    label="Stream settings"
    placement="top-end"
  >
    {quality && !quality.isHidden ? (
      <Box>
        <Dropdown
          disabled={quality.isDisabled}
          elementResolver={qualityElementResolver}
          elementsList={quality.options}
          leftIcon={<Sliders />}
          onSelect={quality.handleSelect}
          placeholder="Quality"
          selected={quality.value}
          testId="qualitySelect"
        />
      </Box>
    ) : undefined}

    {sources && (
      <Box marginTop="20px">
        <Dropdown
          disabled={sources.isDisabled}
          elementResolver={(e: unknown) => e as Element}
          elementsList={sources.options}
          leftIcon={<IconCameraOn />}
          onSelect={sources.handleSelect}
          placeholder="Source"
          selected={sources.value}
          testId="videoSourcesSelect"
        />
      </Box>
    )}
  </Popover>
);

export default SettingsPopover;
