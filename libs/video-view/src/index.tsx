import React, { memo, useRef, useEffect, useState, ReactNode } from 'react';
import { Flex, IconButton, Spacer, BoxProps, Spinner, Center, Stack, Box } from '@chakra-ui/react';

import { IconFullScreen, IconFullScreenExit } from '@millicast-react/dolbyio-icons';
// import StatisticsInfo from '@millicast-react/statistics-info';
import InfoLabel from '@millicast-react/info-label';
import type { StreamStats } from '@millicast/sdk';

export type VideoViewProps = {
  width: string;
  height: string;
  mirrored?: boolean;
  muted?: boolean;
  displayVideo?: boolean;
  displayMuteButton?: boolean;
  displayFullscreenButton?: boolean;
  mediaStream?: MediaStream;
  statistics?: StreamStats;
  label?: string;
  placeholderNode?: ReactNode;
  onClick?: BoxProps['onClick'];
  showDotIndicator?: boolean;
};

const VideoView = ({
  width,
  height,
  mirrored = false,
  muted = true, // Has to be true for AutoPlay in chromium
  displayVideo = true,
  displayFullscreenButton = true,
  mediaStream,
  // statistics,
  label,
  placeholderNode,
  onClick,
  showDotIndicator,
}: VideoViewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [loadingVideo, setLoadingVideo] = useState(true);
  // const [showStatisticsInfo, setShowStatisticsInfo] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = mediaStream ?? null;
    }
  }, [mediaStream]);

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
      test-id="video-view-wrapper"
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
        test-id="video-view"
      />
      {label && (
        <InfoLabel
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
        position="absolute"
        direction="row"
        width="100%"
        bottom={isFullScreen ? ['120px', '120px', 0] : 0}
        right="0"
        spacing="0"
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
        {displayFullscreenButton && (
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
        )}
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
    </Flex>
  );
};

export default memo(VideoView);
