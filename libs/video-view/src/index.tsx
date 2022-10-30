import React, { memo, useRef, useEffect, useState } from 'react';
import { Box, HStack, IconButton } from '@chakra-ui/react';

import { IconFullScreen, IconFullScreenExit, IconInfo } from '@millicast-react/dolbyio-icons';
import StatisticsInfo from '@millicast-react/statistics-info';
import type { streamStats } from '@millicast/sdk';

export type VideoViewProps = {
  mirrored?: boolean;
  mediaStream?: MediaStream;
  statistics?: streamStats;
};

const VideoView = ({ mirrored = true, mediaStream, statistics }: VideoViewProps) => {
  const video = useRef<HTMLVideoElement>(null);
  const fullScreenButton = useRef<HTMLButtonElement>(null);

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showStatisticsInfo, setshowStatisticsInfo] = useState(false);
  const [isHoveredOnVideo, setIsHoveredOnVideo] = useState(false);

  useEffect(() => {
    if (video.current && mediaStream) {
      video.current.srcObject = mediaStream;
    }
  }, [mediaStream]);

  const componentElementsStyle = {
    '.video': {
      transform: `${mirrored ? 'scaleX(-1)' : ''}`,
    },
    '.video--fullscreen': {
      width: '100vw',
      height: '100vh',
      overflowY: 'hidden',
    },
    '.icon-button': {
      padding: '10px',
      background: 'transparent',
      borderRadius: '0',
      border: '1px solid transparent',
      width: 'min-content',
    },
    '.icon-button--video-on-hover': {
      background: 'white',
      border: '1px solid black',
    },
    '.icon-button: hover': {
      background: 'white',
      border: '1px solid black',
    },
  };

  return (
    <Box
      test-id="video-view-wrapper"
      sx={componentElementsStyle}
      pos={isFullScreen ? 'fixed' : 'relative'}
      bg="black"
      top="0"
      right="0"
      zIndex="1"
    >
      <video
        className={`video ${isFullScreen && 'video--fullscreen'}`}
        playsInline
        // eslint-disable-next-line react/no-unknown-property
        test-id="video-view"
        autoPlay
        ref={video}
        muted
        onMouseOver={() => setIsHoveredOnVideo(true)}
        onMouseOut={() => setIsHoveredOnVideo(false)}
      />
      {showStatisticsInfo && <StatisticsInfo statistics={statistics} />}
      <HStack
        pos="absolute"
        bottom={isFullScreen ? ['120px', '120px', 0] : 0}
        right="0"
        spacing="0"
      >
        <IconButton
          aria-label="Full screen"
          size="md"
          className={`icon-button ${isHoveredOnVideo && 'icon-button--video-on-hover'}`}
          ref={fullScreenButton}
          onClick={() => setIsFullScreen(!isFullScreen)}
          icon={
            isFullScreen ? <IconFullScreenExit fill="black" /> : <IconFullScreen fill="black" />
          }
          onMouseOver={() => setIsHoveredOnVideo(true)}
          onMouseOut={() => setIsHoveredOnVideo(false)}
        />
        <IconButton
          aria-label="Stream Information"
          size="md"
          className="icon-button"
          onClick={() => setshowStatisticsInfo(!showStatisticsInfo)}
          icon={<IconInfo fill="black" />}
        />
      </HStack>
    </Box>
  );
};

export default memo(VideoView);
