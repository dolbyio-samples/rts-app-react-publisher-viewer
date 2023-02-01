import { Box } from '@chakra-ui/react';
import React, { useState } from 'react';

import VideoView from '@millicast-react/video-view';

import { ViewerVideoViewProps } from './types';
import VideoControlBar from './video-control-bar';

const ViewerVideoView = ({
  isStreaming,
  settings,
  showControlBar,
  statistics,
  videoProps = {},
}: ViewerVideoViewProps) => {
  const { mediaStream } = videoProps;

  const [audioTrack] = mediaStream?.getAudioTracks() ?? [];
  const [videoTrack] = mediaStream?.getVideoTracks() ?? [];

  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isPlaybackActive, setIsPlaybackActive] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);

  const enterFullScreen = () => {
    setIsFullScreen(true);

    document.addEventListener('keydown', exitFullScreen);
  };

  const exitFullScreen = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsFullScreen(false);
    }
  };

  const toggleAudio = () => {
    setIsAudioEnabled((prevIsAudioEnabled) => {
      audioTrack.enabled = !prevIsAudioEnabled;

      return audioTrack.enabled;
    });
  };

  const togglePlayback = () => {
    setIsPlaybackActive((prevIsPlaysetIsPlaybackActive) => !prevIsPlaysetIsPlaybackActive);
  };

  const toggleVideo = () => {
    if (videoTrack) {
      setIsVideoEnabled((prevIsVideoEnabled) => {
        videoTrack.enabled = !prevIsVideoEnabled;

        return videoTrack.enabled;
      });
    }
  };

  return (
    <Box
      height="100%"
      margin="0 auto"
      overflow="hidden"
      position="relative"
      sx={{
        ':hover': {
          '&>*': { opacity: 1 },
        },
      }}
      width="100%"
    >
      <VideoView
        displayVideo={isVideoEnabled}
        isFullScreen={isFullScreen}
        muted={!isAudioEnabled}
        playing={isPlaybackActive}
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
          onFullScreen={enterFullScreen}
          opacity={0}
          settings={settings}
          statistics={statistics}
          test-id="videoControlBar"
          toggleAudio={toggleAudio}
          togglePlayback={togglePlayback}
          toggleVideo={toggleVideo}
        />
      ) : undefined}
    </Box>
  );
};

export * from './types';
export default ViewerVideoView;
