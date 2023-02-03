import { Box, Center, HStack, Slider, SliderFilledTrack, SliderThumb, SliderTrack } from '@chakra-ui/react';
import React from 'react';

import {
  IconCameraOff,
  IconCameraOn,
  IconExpand,
  IconPause,
  IconPlay,
  IconSoundOn,
  IconSoundOff,
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
  onChangeVolume: handleChangeVolume,
  onToggleFullScreen: handleFullScreen,
  onToggleAudio: handleToggleAudio,
  onTogglePlayback: handleTogglePlayback,
  onToggleVideo: handleToggleVideo,
  settings,
  statistics,
  volume,
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
        <Box position="relative">
          <IconButton
            icon={activeAudio ? <IconSoundOn /> : <IconSoundOff />}
            isActive={!activeAudio}
            isDisabled={!hasAudioTrack}
            onClick={handleToggleAudio}
            testId="toggleAudioButton"
            tooltipProps={{ label: 'Toggle microphone', placement: 'bottom' }}
          />
          <Center
            background="white"
            borderRadius="4px"
            left="50%"
            padding="12px 0"
            position="absolute"
            top="-16px"
            transform="translate(-50%, -100%)"
            width="100%"
          >
            <Slider
              aria-label="volumeSlider"
              defaultValue={activeAudio ? 100 : 0}
              height="100px"
              max={1}
              min={0}
              onChange={handleChangeVolume}
              orientation="vertical"
              step={0.01}
              value={volume}
            >
              <SliderTrack background="dolbyNeutral.300">
                <SliderFilledTrack background="dolbyPurple.400" />
              </SliderTrack>
              <SliderThumb background="dolbyNeutral.800" />
            </Slider>
          </Center>
        </Box>
        <IconButton
          icon={activeVideo ? <IconCameraOn /> : <IconCameraOff />}
          isActive={!activeVideo}
          isDisabled={!hasVideoTrack}
          onClick={handleToggleVideo}
          testId="toggleVideoButton"
          tooltipProps={{ label: 'Toggle camera', placement: 'bottom' }}
        />
        <IconButton
          icon={activePlayback ? <IconPlay /> : <IconPause />}
          isActive={!activePlayback}
          isDisabled={!hasAudioTrack && !hasVideoTrack}
          onClick={handleTogglePlayback}
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
