import { Box, useDisclosure } from '@chakra-ui/react';
import React from 'react';

import VideoView from '@millicast-react/video-view';

import { IconSettings } from '@millicast-react/dolbyio-icons';
import IconButton from '@millicast-react/icon-button';

import { ViewerVideoViewProps } from './types';
import VideoSettingsDrawer from './video-settings-drawer';

const ViewerVideoView = ({ disableSettings = false, settingsProps, videoProps }: ViewerVideoViewProps) => {
  const { isOpen: isSettingsOpen, onClose: handleSettingsClose, onOpen: handleSettingsOpen } = useDisclosure();

  const { mediaStream } = videoProps;

  return (
    <Box height="fit-content" overflow="hidden" margin="0 auto" position="relative" width="fit-content">
      <VideoView {...videoProps} />
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
        test-id="settingsOpenButton"
        tooltip={{ label: 'Settings' }}
      />
      {!disableSettings ? (
        <VideoSettingsDrawer isOpen={isSettingsOpen} onClose={handleSettingsClose} {...settingsProps} />
      ) : undefined}
    </Box>
  );
};

export * from './types';
export default ViewerVideoView;
