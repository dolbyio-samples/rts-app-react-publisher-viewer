import { Box } from '@chakra-ui/react';
import React from 'react';

import { IconCameraOn, IconSettings } from '@millicast-react/dolbyio-icons';
import Dropdown from '@millicast-react/dropdown';
import Popover from '@millicast-react/popover';

import { SettingsPopoverProps } from './types';
import { qualityElementResolver } from './utils';

const SettingsPopover = ({ iconProps, quality }: SettingsPopoverProps = {}) => (
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
          leftIcon={<IconCameraOn />}
          onSelect={quality.handleSelect}
          placeholder="Quality"
          selected={quality.value}
          testId="qualitySelect"
        />
      </Box>
    ) : undefined}
  </Popover>
);

export * from './types';
export default SettingsPopover;
