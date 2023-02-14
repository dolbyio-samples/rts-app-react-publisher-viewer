import { Box } from '@chakra-ui/react';
import React, { useEffect, useRef } from 'react';

import VideoView from '@millicast-react/video-view';

import { ViewerVideoViewProps } from './types';
import { delay } from './utils';
import VideoControlBar from './video-control-bar';

const SHOW_CONTROL_BAR_DURATION = 2000;

const ViewerVideoView = ({
  controls,
  isStreaming,
  settings,
  showControlBar,
  statistics,
  videoProps = {},
}: ViewerVideoViewProps) => {
  const {
    audioEnabled,
    fullScreen,
    onChangeVolume,
    onToggleAudio,
    onToggleFullScreen,
    onTogglePlayback,
    onToggleVideo,
    playbackActive,
    videoEnabled,
    volume,
  } = controls ?? {};

  const videoViewRef = useRef<HTMLDivElement>(null);
  const isControlBarVisibleRef = useRef<boolean>();

  // Hide/show control bar on mouse move
  useEffect(() => {
    if (!videoViewRef.current) {
      return undefined;
    }

    const handleMouseMove = async (event: MouseEvent) => {
      event.preventDefault();

      isControlBarVisibleRef.current = true;

      await delay(SHOW_CONTROL_BAR_DURATION);

      isControlBarVisibleRef.current = false;
    };

    videoViewRef.current.addEventListener('mousemove', handleMouseMove);

    return () => {
      videoViewRef.current?.removeEventListener('mousemove', handleMouseMove);
    };
  }, [videoViewRef.current]);

  useEffect(() => {
    videoTrack.enabled = videoEnabled;
  }, [videoEnabled]);

  const { mediaStream } = videoProps;

  const [audioTrack] = mediaStream?.getAudioTracks() ?? [];
  const [videoTrack] = mediaStream?.getVideoTracks() ?? [];

  const handleToggleFullScreen = () => {
    onToggleFullScreen?.((prevIsFullScreen) => !prevIsFullScreen);
  };

  const handleChangeVolume = (newVolume: number) => {
    if (newVolume === 0) {
      audioTrack.enabled = false;

      onToggleAudio?.(false);
    } else {
      onToggleAudio?.(true);
    }

    onChangeVolume?.(newVolume);
  };

  const handleToggleAudio = () => {
    onToggleAudio?.((prevIsAudioEnabled) => !prevIsAudioEnabled);
  };

  const handleTogglePlayback = () => {
    onTogglePlayback?.((prevIsPlaysetIsPlaybackActive) => !prevIsPlaysetIsPlaybackActive);
  };

  const handleToggleVideo = () => {
    if (videoTrack) {
      onToggleVideo?.((prevIsVideoEnabled) => !prevIsVideoEnabled);
    }
  };

  return (
    <Box
      bottom={0}
      height={fullScreen ? '100vh' : '100%'}
      left={0}
      margin="0 auto"
      overflow="hidden"
      position={fullScreen ? 'fixed' : 'relative'}
      ref={videoViewRef}
      right={0}
      top={0}
      width={fullScreen ? '100vw' : '100%'}
      zIndex={fullScreen ? '1' : '0'}
    >
      <VideoView
        displayVideo={videoEnabled}
        muted={!audioEnabled}
        paused={!playbackActive}
        volume={volume}
        {...videoProps}
      />
      {showControlBar ? (
        <VideoControlBar
          activeAudio={audioEnabled}
          activePlayback={playbackActive}
          activeVideo={videoEnabled}
          hasAudioTrack={!!audioTrack}
          hasVideoTrack={!!videoTrack}
          isStreaming={isStreaming}
          onChangeVolume={handleChangeVolume}
          onToggleAudio={handleToggleAudio}
          onToggleFullScreen={handleToggleFullScreen}
          onTogglePlayback={handleTogglePlayback}
          onToggleVideo={handleToggleVideo}
          opacity={isControlBarVisibleRef.current ? 1 : 0}
          settings={settings}
          statistics={statistics}
          sx={{
            ':hover': { opacity: 1 },
          }}
          test-id="videoControlBar"
          volume={volume}
        />
      ) : undefined}
    </Box>
  );
};

export * from './types';
export default ViewerVideoView;
