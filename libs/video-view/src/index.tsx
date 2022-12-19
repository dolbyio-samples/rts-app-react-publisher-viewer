import { Box, BoxProps, Center, Flex, Spacer, Spinner, Stack, useDisclosure } from '@chakra-ui/react';
import type { StreamStats } from '@millicast/sdk';
import React, { ReactNode, memo, useEffect, useRef, useState } from 'react';

import { IconFullScreen, IconFullScreenExit, IconSettings } from '@millicast-react/dolbyio-icons';
import IconButton from '@millicast-react/icon-button';
import InfoLabel from '@millicast-react/info-label';
// import StatisticsInfo from '@millicast-react/statistics-info';

import SettingsDrawer, { SettingsDrawerProps } from './components/settings-drawer';

export type VideoViewProps = {
  displayFullscreenButton?: boolean;
  displayMuteButton?: boolean;
  displayVideo?: boolean;
  height: string;
  label?: string;
  mediaStream?: MediaStream;
  mirrored?: boolean;
  muted?: boolean;
  onClick?: BoxProps['onClick'];
  placeholderNode?: ReactNode;
  settings?: Omit<SettingsDrawerProps, 'isOpen' | 'onClose'>;
  showDotIndicator?: boolean;
  statistics?: StreamStats;
  volume?: number;
  width: string;
};

const VideoView = ({
  // statistics,
  displayFullscreenButton = true,
  displayVideo = true,
  height,
  label,
  mediaStream,
  mirrored = false,
  muted = true, // Has to be true for AutoPlay in chromium
  onClick,
  placeholderNode,
  settings,
  showDotIndicator,
  volume = 1,
  width,
}: VideoViewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [loadingVideo, setLoadingVideo] = useState(true);
  // const [showStatisticsInfo, setShowStatisticsInfo] = useState(false);

  const { onClose: handleDrawerClose, onOpen: handleDrawerOpen, isOpen: isDrawerOpen } = useDisclosure();

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = mediaStream ?? null;
    }
  }, [mediaStream]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
  }, [volume]);

  const componentElementsStyle = {
    '.video': {
      transform: `${mirrored ? 'scaleX(-1)' : ''}`,
      display: `${displayVideo ? 'block' : 'none'}`,
      overflow: 'hidden',
      width: '100%',
      height: '100%',
      objectFit: 'contain',
    },
    '.icon-button, .icon-button: hover': {
      padding: '10px',
      background: 'rgba(0,0,0,0.6)',
      borderRadius: '0',
      border: '1px solid transparent',
      width: 'min-content',
      boxShadow: 'unset',
    },
  };

  return (
    <Flex
      test-id="videoViewWrapper"
      sx={componentElementsStyle}
      pos={isFullScreen ? 'fixed' : 'relative'}
      bg="dolbyNeutral.800"
      overflow="hidden"
      borderRadius="8px"
      top="0"
      right="0"
      bottom="0"
      left="0"
      width={isFullScreen ? '100vw' : width}
      height={isFullScreen ? '100vh' : height}
      zIndex={isFullScreen ? '1' : '0'}
      onClick={onClick}
      color="white"
      justifyContent="center"
      alignItems="center"
    >
      {loadingVideo && displayVideo && (
        <Center w="100%" h="100%" position="absolute">
          <Spinner size="lg" />
        </Center>
      )}
      {showDotIndicator && (
        <Box position="absolute" top={5} right={4} w="8px" h="8px" borderRadius="50%" bg="dolbyRed.500" />
      )}

      {!displayVideo && placeholderNode}
      <video
        className="video"
        autoPlay
        playsInline
        crossOrigin="anonymous"
        ref={videoRef}
        muted={muted}
        onWaiting={() => setLoadingVideo(true)}
        onLoadStart={() => setLoadingVideo(true)}
        onPlaying={() => setLoadingVideo(false)}
        onStalled={() => {
          console.error('video is on stalled');
        }}
        onError={() => {
          console.error(`video player error: ${videoRef.current?.error}`);
        }}
        // eslint-disable-next-line react/no-unknown-property
        test-id="videoView"
      />
      {label && (
        <InfoLabel
          test-id="sourceName"
          text={label}
          color="dolbySecondary.200"
          bg="dolbyNeutral.700"
          position="absolute"
          top="4"
          left="4"
          fontWeight="600"
          textTransform="capitalize"
        />
      )}
      {/* {showStatisticsInfo && <StatisticsInfo statistics={statistics} />} */}
      <Stack
        bottom={isFullScreen ? ['120px', '120px', 0] : 0}
        direction="row"
        margin="0 8px 8px"
        position="absolute"
        right="0"
        spacing="0"
        width="100%"
      >
        {/* {displayMuteButton && (
          <IconButton
            test-id="muteSpeakerButton"
            aria-label="Mute button"
            className="icon-button"
            size="md"
            icon={videoRef.current?.muted ? <IconSpeakerOff fill="white" /> : <IconSpeaker fill="white" />}
            onClick={(e) => {
              e.stopPropagation();
              if (videoRef.current) videoRef.current.muted = !videoRef.current.muted;
            }}
          />
        )} */}
        <Spacer />
        {/* {displayFullscreenButton && (
          <IconButton
            test-id="fullScreenButton"
            aria-label="Full screen"
            size="md"
            className="icon-button"
            onClick={(e) => {
              e.stopPropagation();
              setIsFullScreen(!isFullScreen);
            }}
            icon={isFullScreen ? <IconFullScreenExit fill="white" /> : <IconFullScreen fill="white" />}
          />
        )} */}
        <IconButton
          background="transparent"
          icon={<IconSettings />}
          isDisabled={!(mediaStream && mediaStream.getVideoTracks().length)}
          isRound
          onClick={handleDrawerOpen}
          reversed
          size="sm"
          test-id="settingsOpenButton"
          tooltip={{ label: 'Settings' }}
        />
        {/* Disable it temporarily, will bring it back in next release
         <IconButton
          test-id="streamInfoButton"
          aria-label="Stream Information"
          size="md"
          className="icon-button"
          onClick={(e) => {
            e.stopPropagation();
            setShowStatisticsInfo(!showStatisticsInfo);
          }}
          icon={<IconInfo fill="white" />}
        /> */}
      </Stack>
      <SettingsDrawer isOpen={isDrawerOpen} onClose={handleDrawerClose} {...settings} />
    </Flex>
  );
};

export default memo(VideoView);
