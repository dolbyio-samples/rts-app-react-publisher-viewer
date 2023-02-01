import { HStack } from '@chakra-ui/react';
import React from 'react';

import {
  IconCameraOff,
  IconCameraOn,
  IconExpand,
  IconMicrophoneOff,
  IconMicrophoneOn,
  IconPause,
  IconPlay,
} from '@millicast-react/dolbyio-icons';
import IconButton from '@millicast-react/icon-button';
import StatisticsPopover from '@millicast-react/statistics-popover';

import { VideoControlBarProps } from './types';
import SettingsPopover from './settings-popover';

const VideoControlBar = ({
  activeAudio,
  activePlayback,
  activeVideo,
  hasAudioTrack,
  hasVideoTrack,
  isStreaming,
  onFullScreen: handleFullScreen,
  settings,
  statistics,
  toggleAudio,
  togglePlayback,
  toggleVideo,
  ...rest
}: VideoControlBarProps) => {
  const showStatistics = isStreaming && !!statistics;

  return (
    <HStack
      background="backgroundTranslucent"
      bottom="0"
      justify="space-between"
      padding="18px 12px"
      position="absolute"
      right="0"
      spacing="0"
      transition="opacity 0.5s"
      width="100%"
      {...rest}
    >
      <HStack>
        <StatisticsPopover
          iconProps={{ disabled: !showStatistics, visibility: showStatistics ? 'visible' : 'hidden' }}
          statistics={statistics}
        />
      </HStack>
      <HStack>
        <IconButton
          icon={activeAudio ? <IconMicrophoneOn /> : <IconMicrophoneOff />}
          isActive={!activeAudio}
          isDisabled={!hasAudioTrack}
          onClick={toggleAudio}
          testId="toggleAudioButton"
          tooltipProps={{ label: 'Toggle microphone', placement: 'bottom' }}
        />
        <IconButton
          icon={activeVideo ? <IconCameraOn /> : <IconCameraOff />}
          isActive={!activeVideo}
          isDisabled={!hasVideoTrack}
          onClick={toggleVideo}
          testId="toggleVideoButton"
          tooltipProps={{ label: 'Toggle camera', placement: 'bottom' }}
        />
        <IconButton
          icon={activePlayback ? <IconPlay /> : <IconPause />}
          isActive={!activePlayback}
          isDisabled={!hasAudioTrack && !hasVideoTrack}
          onClick={togglePlayback}
          testId="togglePlaybackButton"
          tooltipProps={{ label: 'Toggle playback', placement: 'bottom' }}
        />
      </HStack>
      <HStack>
        <IconButton
          background="none"
          icon={<IconExpand fill="white" />}
          isDisabled={!hasAudioTrack && !hasVideoTrack}
          onClick={handleFullScreen}
          testId="toggleFullScreenButton"
          tooltipProps={{ label: 'Toggle full screen', placement: 'bottom' }}
        />
        <SettingsPopover
          iconProps={{ disabled: !settings, visibility: settings ? 'visible' : 'hidden' }}
          {...settings}
        />
      </HStack>
    </HStack>
  );
};

export * from './types';
export default VideoControlBar;
