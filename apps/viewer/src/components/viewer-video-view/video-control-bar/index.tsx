import { HStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

import {
  IconCameraOff,
  IconCameraOn,
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
  audioTrack,
  isActive,
  settings,
  statistics,
  video,
  videoTrack,
  ...rest
}: VideoControlBarProps) => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(!video?.muted);
  const [isPlaybackActive, setIsPlaybackActive] = useState(!video?.paused);
  const [isVideoEnabled, setIsVideoEnabled] = useState(audioTrack?.enabled);

  useEffect(() => {
    if (!audioTrack) {
      return;
    }

    audioTrack.enabled = isAudioEnabled;
  }, [isAudioEnabled]);

  const handleToggleAudio = () => {
    if (!video) {
      return;
    }

    video.muted = !video.muted;

    setIsAudioEnabled(!video.muted);
  };

  const handleTogglePlayback = () => {
    if (!video) {
      return;
    }

    setIsPlaybackActive((prevIsPlaybackActive) => {
      if (prevIsPlaybackActive) {
        video.pause();
      } else {
        video.play();
      }

      return !video.paused;
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
        <IconButton
          icon={isPlaybackActive ? <IconPlay /> : <IconPause />}
          isActive={!isPlaybackActive}
          isDisabled={!audioTrack && !videoTrack}
          onClick={handleTogglePlayback}
          testId="togglePlaybackButton"
          tooltipProps={{ label: 'Toggle playback', placement: 'top' }}
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
