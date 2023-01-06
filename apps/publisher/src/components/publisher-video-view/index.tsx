import { Box, useDisclosure } from '@chakra-ui/react';
import React from 'react';

import { IconSettings } from '@millicast-react/dolbyio-icons';
import IconButton from '@millicast-react/icon-button';
import StatisticsPopover from '@millicast-react/statistics-popover';
import VideoView from '@millicast-react/video-view';

import { PublisherVideoViewProps } from './types';
import VideoSettingsDrawer from './video-settings-drawer';

const PublisherVideoView = ({
  isActive,
  disableSettings,
  settingsProps,
  statistics,
  videoProps,
}: PublisherVideoViewProps) => {
  const { onClose: handleSettingsClose, onOpen: handleSettingsOpen, isOpen: isSettingsOpen } = useDisclosure();

  const { mediaStream } = videoProps;

  return (
    <Box height="fit-content" overflow="hidden" margin="0 auto" position="relative" width="fit-content">
      <VideoView {...videoProps} />
      {isActive && statistics ? (
        <Box bottom="12px" left="18px" position="absolute">
          <StatisticsPopover statistics={statistics} />
        </Box>
      ) : undefined}
      <IconButton
        background="transparent"
        bottom="12px"
        icon={<IconSettings />}
        isDisabled={!(mediaStream && mediaStream.getVideoTracks().length)}
        isRound
        onClick={handleSettingsOpen}
        position="absolute"
        right="18px"
        reversed
        size="sm"
        testId="settingsOpenButton"
        tooltipProps={{ label: 'Settings' }}
      />
      {!disableSettings ? (
        <VideoSettingsDrawer isOpen={isSettingsOpen} onClose={handleSettingsClose} {...settingsProps} />
      ) : undefined}
    </Box>
  );
};

export * from './types';
export default PublisherVideoView;
