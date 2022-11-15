import React, { memo, useRef, useEffect, useState } from 'react';
import { Box, HStack, IconButton, Spacer } from '@chakra-ui/react';

import {
  IconFullScreen,
  IconFullScreenExit,
  IconInfo,
  IconSpeaker,
  IconSpeakerOff,
} from '@millicast-react/dolbyio-icons';
import StatisticsInfo from '@millicast-react/statistics-info';
import type { streamStats } from '@millicast/sdk';

export type VideoViewProps = {
  mirrored?: boolean;
  muted?: boolean;
  displayMuteButton?: boolean;
  mediaStream?: MediaStream;
  statistics?: streamStats;
  height?: number;
};

const VideoView = ({
  mirrored = false,
  muted = false,
  displayMuteButton = true,
  mediaStream,
  statistics,
  height,
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
    },
    '.video--fullscreen': {
      width: '100vw',
      height: '100vh',
      overflowY: 'hidden',
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
        muted={isMuted}
        height={height}
      />
      {showStatisticsInfo && <StatisticsInfo statistics={statistics} />}
      <HStack pos="absolute" width="100%" bottom={isFullScreen ? ['120px', '120px', 0] : 0} right="0" spacing="0">
        {displayMuteButton && (
          <IconButton
            aria-label="Mute button"
            className="icon-button"
            size="md"
            icon={isMuted ? <IconSpeakerOff fill="white" /> : <IconSpeaker fill="white" />}
            onClick={() => setIsMuted(!isMuted)}
          />
        )}
        <Spacer />
        <IconButton
          aria-label="Full screen"
          size="md"
          className="icon-button"
          onClick={() => setIsFullScreen(!isFullScreen)}
          icon={isFullScreen ? <IconFullScreenExit fill="white" /> : <IconFullScreen fill="white" />}
        />
        <IconButton
          aria-label="Stream Information"
          size="md"
          className="icon-button"
          onClick={() => setshowStatisticsInfo(!showStatisticsInfo)}
          icon={<IconInfo fill="white" />}
        />
      </HStack>
    </Box>
  );
};

export default memo(VideoView);
