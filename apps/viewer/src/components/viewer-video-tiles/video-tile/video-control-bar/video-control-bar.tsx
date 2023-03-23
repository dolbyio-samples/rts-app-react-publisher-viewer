import { Box, Center, HStack, Slider, SliderFilledTrack, SliderThumb, SliderTrack } from '@chakra-ui/react';
import React from 'react';

import {
  IconCameraOff,
  IconCameraOn,
  IconFullScreen,
  IconFullScreenExit,
  IconPause,
  IconPlay,
  IconSoundOn,
  IconSoundOff,
} from '@millicast-react/dolbyio-icons';
import IconButton from '@millicast-react/icon-button';
import StatisticsPopover from '@millicast-react/statistics-popover';

import SettingsPopover from './settings-popover';
import { VideoControlBarProps } from './types';

const VideoControlBar = ({
  activeAudio,
  activePlayback,
  activeVideo,
  hasAudioTrack,
  hasVideoTrack,
  isFullScreen,
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
        {hasAudioTrack ? (
          <Box position="relative" sx={{ ':hover>.volume-slider-wrapper': { opacity: 1, visibility: 'visible' } }}>
            <IconButton
              icon={activeAudio ? <IconSoundOn /> : <IconSoundOff />}
              isActive={!activeAudio}
              onClick={handleToggleAudio}
              testId="toggleAudioButton"
              tooltipProps={{ label: 'Toggle audio', placement: 'bottom' }}
            />
            <Box
              className="volume-slider-wrapper"
              left="50%"
              opacity={0}
              position="absolute"
              sx={{ ':hover': { opacity: 1, visibility: 'visible' } }}
              top={0}
              transform="translate(-50%, -100%)"
              transition="visibility linear 0.5s, opacity 0.5s"
              visibility="hidden"
              width="100%"
            >
              <Center background="white" borderRadius="4px" marginBottom="16px" padding="12px 0" width="100%">
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
          </Box>
        ) : undefined}
        {hasVideoTrack ? (
          <IconButton
            icon={activeVideo ? <IconCameraOn /> : <IconCameraOff />}
            isActive={!activeVideo}
            onClick={handleToggleVideo}
            testId="toggleVideoButton"
            tooltipProps={{ label: 'Toggle video', placement: 'bottom' }}
          />
        ) : undefined}
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
          icon={isFullScreen ? <IconFullScreenExit fill="white" /> : <IconFullScreen fill="white" />}
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

export default VideoControlBar;
