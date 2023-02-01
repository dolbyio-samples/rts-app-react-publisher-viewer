import { Box, Center, Flex, Spinner } from '@chakra-ui/react';
import React, { memo, useEffect, useRef, useState } from 'react';

import InfoLabel from '@millicast-react/info-label';

import { VideoViewProps } from './types';

const VideoView = ({
  // displayFullscreenButton = true,
  displayVideo = true,
  height,
  label,
  maxHeight,
  maxWidth,
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
  volume = 1,
  width,
}: VideoViewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [loadingVideo, setLoadingVideo] = useState(true);
  const [streamId, setStreamId] = useState<string | null>(null);

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
    '.icon-button, .icon-button: hover': {
      background: 'rgba(0,0,0,0.6)',
      border: '1px solid transparent',
      borderRadius: '0',
      boxShadow: 'unset',
      padding: '10px',
      width: 'min-content',
    },
    '.video': {
      height: '100%',
      objectFit: 'contain',
      overflow: 'hidden',
      transform: `${mirrored ? 'scaleX(-1)' : ''}`,
      width: '100%',
    },
  };

  return (
    <Flex
      alignItems="center"
      background="dolbyNeutral.800"
      borderRadius="8px"
      bottom="0"
      color="white"
      height={isFullScreen ? '100vh' : height ?? '100%'}
      justifyContent="center"
      left="0"
      margin="0 auto"
      maxHeight={maxHeight}
      maxWidth={maxWidth}
      onClick={onClick}
      overflow="hidden"
      pos={isFullScreen ? 'fixed' : 'relative'}
      right="0"
      sx={componentElementsStyle}
      test-id="videoViewWrapper"
      top="0"
      width={isFullScreen ? '100vw' : width ?? '100%'}
      zIndex={isFullScreen ? '1' : '0'}
    >
      {loadingVideo && displayVideo && (
        <Center h="100%" position="absolute" w="100%">
          <Spinner size="lg" />
        </Center>
      )}
      <video
        autoPlay
        className="video"
        crossOrigin="anonymous"
        loop={src ? true : false}
        muted={muted}
        onCanPlay={onCanPlay}
        onError={() => {
          onError && videoRef.current?.error
            ? onError(videoRef.current.error)
            : console.error(`video player error: ${videoRef.current?.error}`);
        }}
        onLoadStart={() => setLoadingVideo(true)}
        onPlaying={() => setLoadingVideo(false)}
        onStalled={() => {
          console.error('video is on stalled');
        }}
        onWaiting={() => setLoadingVideo(true)}
        playsInline
        ref={videoRef}
        // eslint-disable-next-line react/no-unknown-property
        test-id="videoView"
      />
      {!displayVideo ? placeholderNode : undefined}
      {label ? (
        <InfoLabel
          bg="dolbyNeutral.700"
          color="dolbySecondary.200"
          fontWeight="600"
          left="4"
          position="absolute"
          test-id="sourceName"
          text={label}
          textTransform="capitalize"
          top="4"
        />
      ) : undefined}
      {showDotIndicator ? (
        <Box bg="dolbyRed.500" borderRadius="50%" h="8px" position="absolute" right={4} top={5} w="8px" />
      ) : undefined}
    </Flex>
  );
};

export * from './types';
export default memo(VideoView);
