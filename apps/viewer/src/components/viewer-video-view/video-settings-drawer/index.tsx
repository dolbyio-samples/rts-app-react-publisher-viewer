import { Box } from '@chakra-ui/react';
import React from 'react';

import { IconCameraOn } from '@millicast-react/dolbyio-icons';
import Drawer from '@millicast-react/drawer';
import Dropdown from '@millicast-react/dropdown';

import { VideoSettingsDrawerProps } from './types';
import { qualityElementResolver } from './utils';

const VideoSettingsDrawer = ({ isOpen, onClose: handleClose, quality }: VideoSettingsDrawerProps) => (
  <Drawer
    heading="Settings"
    headingProps={{ 'test-id': 'streamSettingsPopoverHeading' }}
    isOpen={isOpen}
    onClose={handleClose}
  >
    {quality && !quality.isHidden ? (
      <Box>
        <Dropdown
          disabled={quality.isDisabled}
          elementsList={quality.options}
          elementResolver={qualityElementResolver}
          leftIcon={<IconCameraOn />}
          onSelect={quality.handleSelect}
          placeholder="Quality"
          selected={quality.value}
          testId="qualitySelect"
        />
      </Box>
    ) : undefined}
  </Drawer>
);

export * from './types';
export default VideoSettingsDrawer;
