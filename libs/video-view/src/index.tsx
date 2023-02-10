import { Box, Center, Flex, HStack, Spinner } from '@chakra-ui/react';
import React, { memo, useEffect, useRef, useState } from 'react';

import InfoLabel from '@millicast-react/info-label';

import { HTMLVideoElementWithCaptureStream, VideoViewProps } from './types';

const VideoView = ({
  displayVideo = true,
  height,
  label,
  mediaStream,
  mirrored,
  muted = true, // Has to be true for AutoPlay in chromium
  onClick,
  onError,
  onSrcMediaStreamClose: handleSrcMediaStreamClose,
  onSrcMediaStreamReady: handleSrcMediaStreamReady,
  placeholderNode,
  paused = false,
  showDotIndicator,
  src,
  volume = 1,
  width,
}: VideoViewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [loadingVideo, setLoadingVideo] = useState(true);
  const [streamId, setStreamId] = useState<string>();

  // Initialise video
  useEffect(() => {
    if (videoRef.current) {
      if (src) {
        videoRef.current.srcObject = null;
        videoRef.current.src = src;
      } else if (mediaStream) {
        videoRef.current.srcObject = mediaStream;
      }
    }
  }, [src]);

  // Toggle mute
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = muted;

      if (!muted) {
        videoRef.current.volume = volume;
      }
    }
  }, [muted]);

  // Toggle playback
  useEffect(() => {
    if (videoRef.current) {
      if (!paused) {
        videoRef.current.play().catch(() => null);
      } else {
        videoRef.current.pause();
      }
    }
  }, [paused]);

  // Change volume
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
  }, [volume]);

  // Clean up
  useEffect(() => {
    return () => {
      if (streamId) {
        handleSrcMediaStreamClose?.(streamId);
      }
    };
  }, [streamId]);

  const onCanPlay = () => {
    if (videoRef.current && !mediaStream) {
      // Custom type as captureStream is not defined in HTMLVideoElement by default
      const capturedMediaStream = (videoRef.current as HTMLVideoElementWithCaptureStream).captureStream();

      handleSrcMediaStreamReady?.(capturedMediaStream);
      setStreamId(capturedMediaStream.id);
    }
  };

  return (
    <Flex
      alignItems="center"
      background="dolbyNeutral.800"
      borderRadius="8px"
      bottom="0"
      color="white"
      height={height ?? '100%'}
      justifyContent="center"
      left="0"
      margin="0 auto"
      onClick={onClick}
      overflow="hidden"
      position="relative"
      right="0"
      test-id="videoViewWrapper"
      top="0"
      width={width ?? '100%'}
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
            : console.error(`Video player error: ${videoRef.current?.error}`);
        }}
        onLoadStart={() => setLoadingVideo(true)}
        onPlaying={() => setLoadingVideo(false)}
        onStalled={() => {
          console.error('Video is on stalled');
        }}
        onWaiting={() => setLoadingVideo(true)}
        playsInline
        ref={videoRef}
        style={{
          height: '100%',
          objectFit: 'contain',
          overflow: 'hidden',
          transform: mirrored ? 'scaleX(-1)' : '',
          width: '100%',
        }}
        // eslint-disable-next-line react/no-unknown-property
        test-id="videoView"
      />
      {!displayVideo ? placeholderNode : undefined}
      <HStack left="16px" maxWidth="100%" position="absolute" top="16px" width="100%">
        {label ? (
          <InfoLabel
            background="dolbyNeutral.700"
            color="dolbySecondary.200"
            fontWeight="600"
            maxWidth="90%"
            overflow="hidden"
            test-id="sourceName"
            text={label}
            textOverflow="ellipsis"
            textTransform="capitalize"
            whiteSpace="nowrap"
          />
        ) : undefined}
        {showDotIndicator ? (
          <Box background="dolbyRed.500" borderRadius="50%" height="8px" marginLeft="8px" width="8px" />
        ) : undefined}
      </HStack>
    </Flex>
  );
};

export * from './types';
export default memo(VideoView);
