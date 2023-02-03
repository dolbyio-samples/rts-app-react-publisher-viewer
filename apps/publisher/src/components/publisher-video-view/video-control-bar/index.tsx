import { HStack } from '@chakra-ui/react';
import React from 'react';

import {
  IconCameraOff,
  IconCameraOn,
  IconMicrophoneOff,
  IconMicrophoneOn,
  IconPause,
  IconPlay,
  IconSoundOff,
  IconSoundOn,
} from '@millicast-react/dolbyio-icons';
import IconButton from '@millicast-react/icon-button';
import StatisticsPopover from '@millicast-react/statistics-popover';

import { VideoControlBarProps } from './types';
import SettingsPopover from './settings-popover';
import LiveIndicator from '@millicast-react/live-indicator';
import { StreamTypes } from '@millicast-react/use-multi-media-streams';

const VideoControlBar = ({
  activeAudio,
  activePlayback,
  activeVideo,
  canTogglePlayback,
  hasAudioTrack,
  hasVideoTrack,
  isConnecting = false,
  isStreaming = false,
  onStartLive: handleStartLive,
  onStopLive: handleStopLive,
  onToggleAudio: handleToggleAudio,
  onTogglePlayback: handleTogglePlayback,
  onToggleVideo: handleToggleVideo,
  settings,
  statistics,
  streamType,
  ...rest
}: VideoControlBarProps) => {
  const audioIcon =
    streamType === StreamTypes.MEDIA ? (
      activeAudio ? (
        <IconMicrophoneOn />
      ) : (
        <IconMicrophoneOff />
      )
    ) : activeAudio ? (
      <IconSoundOn />
    ) : (
      <IconSoundOff />
    );

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
        {hasAudioTrack ? (
          <IconButton
            icon={audioIcon}
            isActive={!activeAudio}
            onClick={handleToggleAudio}
            testId="toggleAudioButton"
            tooltipProps={{ label: 'Toggle microphone', placement: 'bottom' }}
          />
        ) : undefined}
        {hasVideoTrack ? (
          <IconButton
            icon={activeVideo ? <IconCameraOn /> : <IconCameraOff />}
            isActive={!activeVideo}
            onClick={handleToggleVideo}
            testId="toggleVideoButton"
            tooltipProps={{ label: 'Toggle camera', placement: 'bottom' }}
          />
        ) : undefined}
        {canTogglePlayback ? (
          <IconButton
            icon={activePlayback ? <IconPlay /> : <IconPause />}
            isActive={!activePlayback}
            isDisabled={!hasAudioTrack && !hasVideoTrack}
            onClick={handleTogglePlayback}
            testId="togglePlaybackButton"
            tooltipProps={{ label: 'Toggle playback', placement: 'bottom' }}
          />
        ) : undefined}
      </HStack>
      <HStack>
        <LiveIndicator
          disabled={!hasAudioTrack && !hasVideoTrack}
          isActive={isStreaming}
          isLoading={isConnecting}
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
