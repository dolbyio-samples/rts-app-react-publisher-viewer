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
  const [volume, setVolume] = useState(0);

  const enterFullScreen = () => {
    setIsFullScreen(true);

    document.addEventListener('keydown', exitFullScreen);
  };

  const exitFullScreen = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsFullScreen(false);
    }
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
          onFullScreen={enterFullScreen}
          onToggleAudio={handleToggleAudio}
          onTogglePlayback={handleTogglePlayback}
          onToggleVideo={handleToggleVideo}
          opacity={0}
          settings={settings}
          statistics={statistics}
          test-id="videoControlBar"
        />
      ) : undefined}
    </Box>
  );
};

export * from './types';
export default ViewerVideoView;
