import { Box, Center, Flex, Spinner, Stack } from '@chakra-ui/react';
import React, { memo, useEffect, useRef, useState } from 'react';

import ControlBar from '@millicast-react/control-bar';
import { IconCameraOff, IconCameraOn, IconMicrophoneOff, IconMicrophoneOn } from '@millicast-react/dolbyio-icons';
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

  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
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
      alignItems="center"
      bg="dolbyNeutral.800"
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
      <Stack
        bottom={isFullScreen ? ['120px', '120px', 0] : 0}
        direction="row"
        margin="0 8px 12px"
        position="absolute"
        right="0"
        spacing="0"
        width="100%"
      >
        <ControlBar
          bottom="0"
          controls={[
            {
              icon: isAudioEnabled ? <IconMicrophoneOn /> : <IconMicrophoneOff />,
              isActive: !isAudioEnabled,
              isDisabled: !mediaStream?.getAudioTracks().length,
              key: 'toggleMicrophoneButton',
              onClick: () => {
                setIsAudioEnabled((prevIsAudioEnabled) => !prevIsAudioEnabled);
              },
              testId: 'toggleMicrophoneButton',
              tooltipProps: { label: 'Toggle microphone', placement: 'top' },
            },
            {
              icon: isVideoEnabled ? <IconCameraOn /> : <IconCameraOff />,
              isActive: !isVideoEnabled,
              isDisabled: !mediaStream?.getVideoTracks().length,
              key: 'toggleCameraButton',
              onClick: () => {
                setIsVideoEnabled((prevIsVideoEnabled) => !prevIsVideoEnabled);
              },
              testId: 'toggleCameraButton',
              tooltipProps: { label: 'Toggle camera', placement: 'top' },
            },
          ]}
          left="50%"
          position="absolute"
          transform="translateX(-50%)"
        />
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
      </Stack>
    </Flex>
  );
};

export * from './types';
export default memo(VideoView);
