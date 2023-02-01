import { HStack } from '@chakra-ui/react';
import React, { useState } from 'react';

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
import LiveIndicator from '@millicast-react/live-indicator';

const VideoControlBar = ({
  audioTrack,
  canTogglePlayback,
  onStartLive: handleStartLive,
  onStopLive: handleStopLive,
  settings,
  state,
  statistics,
  videoTrack,
  ...rest
}: VideoControlBarProps) => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(audioTrack?.enabled);
  // TODO: local file playback
  const [isPlaybackActive, setIsPlaybackActive] = useState(true);
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

  const handleTogglePlayback = () => {
    if (!canTogglePlayback) {
      return;
    }

    setIsPlaybackActive((prevIsPlaybackActive) => {
      // TODO: local file playback

      return !prevIsPlaybackActive;
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

  const isStreaming = state === 'streaming';

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
          iconProps={{ disabled: !isStreaming, visibility: isStreaming ? 'visible' : 'hidden' }}
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
        {canTogglePlayback ? (
          <IconButton
            icon={isPlaybackActive ? <IconPlay /> : <IconPause />}
            isActive={!isPlaybackActive}
            isDisabled={!audioTrack && !videoTrack}
            onClick={handleTogglePlayback}
            testId="togglePlaybackButton"
            tooltipProps={{ label: 'Toggle playback', placement: 'top' }}
          />
        ) : undefined}
      </HStack>
      <HStack>
        <LiveIndicator
          disabled={!audioTrack && !videoTrack}
          isActive={isStreaming}
          isLoading={state === 'connecting'}
          start={handleStartLive}
          stop={handleStopLive}
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
