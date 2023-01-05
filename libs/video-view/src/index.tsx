import { Box, Center, Flex, Spacer, Spinner, Stack } from '@chakra-ui/react';
import React, { memo, useEffect, useRef, useState } from 'react';

import InfoLabel from '@millicast-react/info-label';
// import StatisticsInfo from '@millicast-react/statistics-info';

import { VideoViewProps } from './types';

const VideoView = ({
  // displayFullscreenButton = true,
  displayVideo = true,
  height,
  label,
  mediaStream,
  mirrored = false,
  muted = true, // Has to be true for AutoPlay in chromium
  onClick,
  onError,
  onSrcMediaStreamClose,
  onSrcMediaStreamReady,
  placeholderNode,
  showDotIndicator,
  src,
  // statistics,
  volume = 1,
  width,
}: VideoViewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streamId, setStreamId] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [loadingVideo, setLoadingVideo] = useState(true);
  // const [showStatisticsInfo, setShowStatisticsInfo] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      if (src) {
        videoRef.current.srcObject = null;
        videoRef.current.src = src;
      } else if (mediaStream) {
        videoRef.current.srcObject = mediaStream;
      }
    }
  }, [mediaStream, src]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    return () => {
      if (streamId) {
        onSrcMediaStreamClose?.(streamId);
      }
    };
  }, [streamId]);

  const onCanPlay = () => {
    //@ts-expect-error property exists but it isn't in the built-in type
    const stream = videoRef.current?.captureStream() as MediaStream;
    onSrcMediaStreamReady?.(stream);
    setStreamId(stream.id);
  };

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
        crossOrigin="anonymous"
        className="video"
        autoPlay
        playsInline
        loop={src ? true : false}
        ref={videoRef}
        muted={muted}
        onCanPlay={onCanPlay}
        onWaiting={() => setLoadingVideo(true)}
        onLoadStart={() => setLoadingVideo(true)}
        onPlaying={() => setLoadingVideo(false)}
        onStalled={() => {
          console.error('video is on stalled');
        }}
        onError={() => {
          onError && videoRef.current?.error
            ? onError(videoRef.current.error)
            : console.error(`video player error: ${videoRef.current?.error}`);
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

export * from './types';
export default memo(VideoView);
