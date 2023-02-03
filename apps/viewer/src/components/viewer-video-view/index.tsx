import { Box } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';

import VideoView from '@millicast-react/video-view';

import { ViewerVideoViewProps } from './types';
import VideoControlBar from './video-control-bar';

const SHOW_CONTROL_BAR_DURATION = 2000;

const ViewerVideoView = ({
  isStreaming,
  settings,
  showControlBar,
  statistics,
  videoProps = {},
}: ViewerVideoViewProps) => {
  const videoViewRef = useRef<HTMLDivElement>(null);
  const isControlBarVisibleRef = useRef<boolean>();

  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isPlaybackActive, setIsPlaybackActive] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [volume, setVolume] = useState(0);

  // @ts-expect-error Not all code paths return a value.
  useEffect(() => {
    if (videoViewRef.current) {
      const handleMouseMove = (event: MouseEvent) => {
        event.preventDefault();

        isControlBarVisibleRef.current = true;

        new Promise((resolve) => setTimeout(resolve, SHOW_CONTROL_BAR_DURATION)).then(() => {
          isControlBarVisibleRef.current = false;
        });
      };

      videoViewRef.current.addEventListener('mousemove', handleMouseMove);

      return () => {
        videoViewRef.current?.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, [videoViewRef.current]);

  const { mediaStream } = videoProps;

  const [audioTrack] = mediaStream?.getAudioTracks() ?? [];
  const [videoTrack] = mediaStream?.getVideoTracks() ?? [];

  const handleToggleFullScreen = () => {
    setIsFullScreen((prevIsFullScreen) => !prevIsFullScreen);
  };

  const handleChangeVolume = (newVolume: number) => {
    if (newVolume === 0) {
      audioTrack.enabled = false;

      setIsAudioEnabled(false);
    } else {
      audioTrack.enabled = true;

      setIsAudioEnabled(true);
    }

    setVolume(newVolume);
  };

  const handleToggleAudio = () => {
    setIsAudioEnabled((prevIsAudioEnabled) => {
      audioTrack.enabled = !prevIsAudioEnabled;

      return audioTrack.enabled;
    });
  };

  const handleTogglePlayback = () => {
    setIsPlaybackActive((prevIsPlaysetIsPlaybackActive) => !prevIsPlaysetIsPlaybackActive);
  };

  const handleToggleVideo = () => {
    if (videoTrack) {
      setIsVideoEnabled((prevIsVideoEnabled) => {
        videoTrack.enabled = !prevIsVideoEnabled;

        return videoTrack.enabled;
      });
    }
  };

  return (
    <Box
      bottom={0}
      height={isFullScreen ? '100vh' : '100%'}
      left={0}
      margin="0 auto"
      overflow="hidden"
      position={isFullScreen ? 'fixed' : 'relative'}
      ref={videoViewRef}
      right={0}
      top={0}
      width={isFullScreen ? '100vw' : '100%'}
      zIndex={isFullScreen ? '1' : '0'}
    >
      <VideoView
        displayVideo={isVideoEnabled}
        muted={!isAudioEnabled}
        playing={isPlaybackActive}
        volume={volume}
        {...videoProps}
      />
      {showControlBar ? (
        <VideoControlBar
          activeAudio={isAudioEnabled}
          activePlayback={isPlaybackActive}
          activeVideo={isVideoEnabled}
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
        />
      ) : undefined}
    </Box>
  );
};

export * from './types';
export default ViewerVideoView;
