import React, { memo, useRef, useEffect, useState } from 'react';
import { Box, HStack, IconButton, Spacer, BoxProps, Spinner, Center } from '@chakra-ui/react';

import {
  IconFullScreen,
  IconFullScreenExit,
  IconInfo,
  IconSpeaker,
  IconSpeakerOff,
} from '@millicast-react/dolbyio-icons';
import StatisticsInfo from '@millicast-react/statistics-info';
import type { StreamStats } from '@millicast/sdk';

export type VideoViewProps = {
  width?: string;
  height?: string;
  mirrored?: boolean;
  muted?: boolean;
  displayMuteButton?: boolean;
  mediaStream?: MediaStream;
  statistics?: StreamStats;
  onClick?: BoxProps['onClick'];
};

const VideoView = ({
  width,
  height,
  mirrored = false,
  muted = false,
  displayMuteButton = true,
  mediaStream,
  statistics,
  onClick,
}: VideoViewProps) => {
  const video = useRef<HTMLVideoElement>(null);

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showStatisticsInfo, setshowStatisticsInfo] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);

  useEffect(() => {
    if (video.current && mediaStream) {
      video.current.srcObject = mediaStream;
    }
  }, [mediaStream]);

  const componentElementsStyle = {
    '.video': {
      transform: `${mirrored ? 'scaleX(-1)' : ''}`,
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
    <Box
      test-id="video-view-wrapper"
      sx={componentElementsStyle}
      pos={isFullScreen ? 'fixed' : 'relative'}
      bg="black"
      bottom="0"
      right="0"
      width={isFullScreen ? '100vw' : width}
      height={isFullScreen ? '100vh' : height}
      zIndex={isFullScreen ? '1' : '0'}
      onClick={onClick}
    >
      {loadingVideo && (
        <Center w="100%" h="100%">
          <Spinner size="lg" zIndex="2" />
        </Center>
      )}

      <video
        className="video"
        playsInline
        // eslint-disable-next-line react/no-unknown-property
        test-id="video-view"
        autoPlay
        ref={video}
        muted={isMuted}
        onWaiting={() => setLoadingVideo(true)}
        onLoadStart={() => setLoadingVideo(true)}
        onPlay={() => setLoadingVideo(false)}
      />
      {showStatisticsInfo && <StatisticsInfo statistics={statistics} />}
      <HStack pos="absolute" width="100%" bottom={isFullScreen ? ['120px', '120px', 0] : 0} right="0" spacing="0">
        {displayMuteButton && (
          <IconButton
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
          aria-label="Stream Information"
          size="md"
          className="icon-button"
          onClick={(e) => {
            e.stopPropagation();
            setshowStatisticsInfo(!showStatisticsInfo);
          }}
          icon={<IconInfo fill="white" />}
        />
      </HStack>
    </Box>
  );
};

export default memo(VideoView);
