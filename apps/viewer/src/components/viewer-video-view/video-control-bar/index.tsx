import { HStack } from '@chakra-ui/react';
import React, { useState } from 'react';

import { IconCameraOff, IconCameraOn, IconMicrophoneOff, IconMicrophoneOn } from '@millicast-react/dolbyio-icons';
import IconButton from '@millicast-react/icon-button';
import StatisticsPopover from '@millicast-react/statistics-popover';

import { VideoControlBarProps } from './types';
import SettingsPopover from './settings-popover';

const VideoControlBar = ({ audioTrack, isActive, settings, statistics, videoTrack, ...rest }: VideoControlBarProps) => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(audioTrack?.enabled);
  const [isVideoEnabled, setIsVideoEnabled] = useState(videoTrack?.enabled);

  const handleToggleAudio = () => {
    if (!audioTrack) {
      return;
    }

    setIsAudioEnabled((prevIsAudioEnabled) => {
      audioTrack.enabled = !prevIsAudioEnabled;

      return audioTrack.enabled;
    });
  };

  const handleToggleVideo = () => {
    if (!videoTrack) {
      return;
    }

    setIsVideoEnabled((prevIsVideoEnabled) => {
      videoTrack.enabled = !prevIsVideoEnabled;

      return videoTrack.enabled;
    });
  };

  const showStatistics = isActive && !!statistics;

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
          icon={isAudioEnabled ? <IconMicrophoneOn /> : <IconMicrophoneOff />}
          isActive={!isAudioEnabled}
          isDisabled={!audioTrack}
          onClick={handleToggleAudio}
          testId="toggleAudioButton"
          tooltipProps={{ label: 'Toggle microphone', placement: 'top' }}
        />
        <IconButton
          icon={isVideoEnabled ? <IconCameraOn /> : <IconCameraOff />}
          isActive={!isVideoEnabled}
          isDisabled={!videoTrack}
          onClick={handleToggleVideo}
          testId="toggleVideoButton"
          tooltipProps={{ label: 'Toggle camera', placement: 'top' }}
        />
      </HStack>
      <HStack>
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
