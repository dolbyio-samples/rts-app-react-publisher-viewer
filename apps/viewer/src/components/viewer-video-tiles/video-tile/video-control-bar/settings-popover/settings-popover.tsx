import { Box } from '@chakra-ui/react';
import React from 'react';

import { IconCameraOn, IconSettings, Sliders, SidebarReverse } from '@millicast-react/dolbyio-icons';
import Dropdown, { Element } from '@millicast-react/dropdown';
import Popover from '@millicast-react/popover';
import ToggleButton from '@millicast-react/toggle-button';

import { SettingsPopoverProps } from './types';
import { qualityElementResolver } from './utils';

const SettingsPopover = ({ iconProps, quality, sources, multiview }: SettingsPopoverProps = {}) => (
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
          leftIcon={<Sliders width="90%" height="90%" />}
          onSelect={quality.handleSelect}
          placeholder="Quality"
          selected={quality.value}
          testId="qualitySelect"
        />
      </Box>
    ) : undefined}

    {sources && (
      <Box marginTop="5px">
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

    {multiview && !multiview.isHidden && (
      <Box marginTop="5px">
        <ToggleButton
          height="48px"
          isActive={multiview.value}
          isDisabled={multiview.isDisabled}
          label={`${multiview.value ? 'Hide' : 'Show'} Multi-view`}
          leftIcon={<SidebarReverse width="90%" height="90%" />}
          onClick={multiview.handleToggle}
          test-id="showMultiviewToggle"
        />
      </Box>
    )}
  </Popover>
);

export default SettingsPopover;
