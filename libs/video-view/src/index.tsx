import React, { memo, useRef, useEffect, useState, ReactNode } from 'react';
import { Flex, IconButton, Spacer, BoxProps, Spinner, Center, Stack } from '@chakra-ui/react';

import {
  IconFullScreen,
  IconFullScreenExit,
  IconInfo,
  IconSpeaker,
  IconSpeakerOff,
} from '@millicast-react/dolbyio-icons';
import StatisticsInfo from '@millicast-react/statistics-info';
import InfoLabel from '@millicast-react/info-label';
import type { StreamStats } from '@millicast/sdk';

export type VideoViewProps = {
  width?: string;
  height?: string;
  mirrored?: boolean;
  muted?: boolean;
  video?: boolean;
  displayMuteButton?: boolean;
  mediaStream?: MediaStream;
  statistics?: StreamStats;
  label?: string;
  placeholderNode?: ReactNode;
  onClick?: BoxProps['onClick'];
};

const VideoView = ({
  width,
  height,
  mirrored = false,
  muted = false,
  video = true,
  displayMuteButton = true,
  mediaStream,
  statistics,
  label,
  placeholderNode,
  onClick,
}: VideoViewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showStatisticsInfo, setShowStatisticsInfo] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);

  useEffect(() => {
    console.log(mediaStream, videoRef.current);
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
      bottom="0"
      right="0"
      width={isFullScreen ? '100vw' : width}
      height={isFullScreen ? '100vh' : height}
      zIndex={isFullScreen ? '1' : '0'}
      onClick={onClick}
      color="white"
      justifyContent="center"
      alignItems="center"
      position="relative"
    >
      {loadingVideo && (
        <Center w="100%" h="100%">
          <Spinner size="lg" zIndex="2" />
        </Center>
      )}

      {placeholderNode}
      <video
        // eslint-disable-next-line react/no-unknown-property
        test-id="video-view"
        className="video"
        playsInline
        autoPlay
        ref={videoRef}
        muted={isMuted}
        onWaiting={() => setLoadingVideo(true)}
        onLoadStart={() => setLoadingVideo(true)}
        onPlay={() => setLoadingVideo(false)}
      />
      {label !== undefined && (
        <InfoLabel
          text="Presenter"
          color="dolbySecondary.200"
          bg="dolbyNeutral.700"
          position="absolute"
          top="4"
          left="4"
          fontWeight="600"
        />
      )}
      {showStatisticsInfo && <StatisticsInfo statistics={statistics} />}
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
        />
      </Stack>
    </Flex>
  );
};

export default memo(VideoView);
