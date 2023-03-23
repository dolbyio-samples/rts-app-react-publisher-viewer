import { Box, CloseButton } from '@chakra-ui/react';
import React, { useState } from 'react';

import VideoView from '@millicast-react/video-view';
import { StreamTypes } from 'apps/publisher/src/hooks/use-multi-media-streams';

import { VideoTileProps } from './types';
import VideoControlBar from './video-control-bar';

const VideoTile = ({
  canTogglePlayback,
  isConnecting,
  isStreaming,
  onRemove: handleRemove,
  onStartLive: handleStartLive,
  onStopLive: handleStopLive,
  settings,
  statistics,
  streamType,
  videoProps,
}: VideoTileProps) => {
  const { mediaStream } = videoProps;

  const [audioTrack] = mediaStream?.getAudioTracks() ?? [];
  const [videoTrack] = mediaStream?.getVideoTracks() ?? [];

  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isPlaybackActive, setIsPlaybackActive] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);

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
        muted={streamType === StreamTypes.MEDIA || !isAudioEnabled}
        paused={!isPlaybackActive}
        {...videoProps}
      />
      {handleRemove ? (
        <CloseButton color="white" onClick={handleRemove} position="absolute" right="4px" size="lg" top="4px" />
      ) : undefined}
      <VideoControlBar
        activeAudio={isAudioEnabled}
        activePlayback={isPlaybackActive}
        activeVideo={isVideoEnabled}
        canTogglePlayback={canTogglePlayback}
        hasAudioTrack={!!audioTrack}
        hasVideoTrack={!!videoTrack}
        isConnecting={isConnecting}
        isStreaming={isStreaming}
        onStartLive={handleStartLive}
        onStopLive={handleStopLive}
        onToggleAudio={handleToggleAudio}
        onTogglePlayback={handleTogglePlayback}
        onToggleVideo={handleToggleVideo}
        opacity={0}
        settings={settings}
        statistics={statistics}
        streamType={streamType}
        test-id="videoControlBar"
      />
    </Box>
  );
};

export default VideoTile;
