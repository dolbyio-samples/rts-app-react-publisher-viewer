import React, { memo, useRef, useEffect, useState, ReactNode } from 'react';
import { Flex, IconButton, Spacer, BoxProps, Spinner, Center, Stack, Box } from '@chakra-ui/react';

import { IconFullScreen, IconFullScreenExit, IconSpeaker, IconSpeakerOff } from '@millicast-react/dolbyio-icons';
// import StatisticsInfo from '@millicast-react/statistics-info';
import InfoLabel from '@millicast-react/info-label';
import type { StreamStats } from '@millicast/sdk';

export type VideoViewProps = {
  width?: string;
  height?: string;
  mirrored?: boolean;
  muted?: boolean;
  video?: boolean;
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
  muted = false,
  video = true,
  displayMuteButton = false,
  displayFullscreenButton = true,
  mediaStream,
  // statistics,
  label,
  placeholderNode,
  onClick,
  showDotIndicator: dotIndicator,
}: VideoViewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  // const [showStatisticsInfo, setShowStatisticsInfo] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);

  useEffect(() => {
    if (videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
    }
  }, [mediaStream]);

  const componentElementsStyle = {
    '.video': {
      transform: `${mirrored ? 'scaleX(-1)' : ''}`,
      display: video ? 'block' : 'none',
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

  const [loadingVideo, setLoadingVideo] = useState(false);

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
      {loadingVideo && video && (
        <Center w="100%" h="100%" position="absolute">
          <Spinner size="lg" />
        </Center>
      )}
      {dotIndicator && (
        <Box position="absolute" top={5} right={4} w="8px" h="8px" borderRadius="50%" bg="dolbyRed.500" />
      )}

      {!video && placeholderNode}
      <video
        // eslint-disable-next-line react/no-unknown-property
        test-id="video-view"
        className="video"
        playsInline
        autoPlay
        crossOrigin="anonymous"
        ref={videoRef}
        muted={isMuted}
        onWaiting={() => setLoadingVideo(true)}
        onLoadStart={() => setLoadingVideo(true)}
        onPlay={() => setLoadingVideo(false)}
        onStalled={() => {
          console.error('video is on stalled');
        }}
        onError={() => {
          console.error(`video player error: ${videoRef.current?.error}`);
        }}
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
        {displayMuteButton && (
          <IconButton
            test-id="muteSpeakerButton"
            aria-label="Mute button"
            className="icon-button"
            size="md"
            icon={isMuted ? <IconSpeakerOff fill="white" /> : <IconSpeaker fill="white" />}
            onClick={(e) => {
              e.stopPropagation();
              setIsMuted(!isMuted);
            }}
          />
        )}
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
