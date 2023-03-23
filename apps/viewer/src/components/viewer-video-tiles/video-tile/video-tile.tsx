import { Box } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';

import VideoView from '@millicast-react/video-view';

import { VideoTileProps } from './types';
import { delay } from './utils';
import VideoControlBar from './video-control-bar';

const SHOW_CONTROL_BAR_DURATION = 2000;

const VideoTile = ({
  controls,
  isStreaming,
  settings,
  showControlBar,
  statistics,
  videoProps = {},
}: VideoTileProps) => {
  const {
    audioEnabled,
    fullScreen,
    onChangeVolume,
    onToggleAudio,
    onToggleFullScreen,
    onToggleVideo,
    videoEnabled,
    volume,
  } = controls ?? {};

  const videoViewRef = useRef<HTMLDivElement>(null);
  const isControlBarVisibleRef = useRef<boolean>();

  const [isPlaybackActive, setIsPlaybackActive] = useState(true);

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

  // Reenable playback when switching main source
  useEffect(() => {
    setIsPlaybackActive(true);
  }, [videoProps.label]);

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
    if (newVolume === 0 && audioEnabled) {
      onToggleAudio?.(false);
    } else if (!audioEnabled && newVolume > 0) {
      onToggleAudio?.(true);
    }

    onChangeVolume?.(newVolume);
  };

  const handleToggleAudio = () => {
    if (audioEnabled) {
      onToggleAudio?.(false);
    } else if (volume === 0) {
      handleChangeVolume(0.5);
    } else {
      onToggleAudio?.(true);
    }
  };

  const handleTogglePlayback = () => {
    setIsPlaybackActive((prevIsPlaysetIsPlaybackActive) => !prevIsPlaysetIsPlaybackActive);
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
        paused={!isPlaybackActive}
        volume={volume}
        {...videoProps}
      />
      {showControlBar ? (
        <VideoControlBar
          activeAudio={audioEnabled}
          activePlayback={isPlaybackActive}
          activeVideo={videoEnabled}
          hasAudioTrack={!!audioTrack}
          hasVideoTrack={!!videoTrack}
          isFullScreen={fullScreen}
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
          volume={audioEnabled ? volume : 0}
        />
      ) : undefined}
    </Box>
  );
};

export default VideoTile;
