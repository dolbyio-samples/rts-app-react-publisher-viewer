import { Box, CloseButton } from '@chakra-ui/react';
import React from 'react';

import VideoView from '@millicast-react/video-view';

import { PublisherVideoViewProps } from './types';
import VideoControlBar from './video-control-bar';

const PublisherVideoView = ({
  canTogglePlayback,
  onRemove: handleRemove,
  onStartLive: handleStartLive,
  onStopLive: handleStopLive,
  settings,
  state,
  statistics,
  videoProps,
}: PublisherVideoViewProps) => {
  const { mediaStream } = videoProps;

  const [audioTrack] = mediaStream?.getAudioTracks() ?? [];
  const [videoTrack] = mediaStream?.getVideoTracks() ?? [];

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
      <VideoView {...videoProps} />
      <CloseButton color="white" onClick={handleRemove} position="absolute" right="4px" size="lg" top="4px" />
      <VideoControlBar
        audioTrack={audioTrack}
        canTogglePlayback={canTogglePlayback}
        onStartLive={handleStartLive}
        onStopLive={handleStopLive}
        opacity={0}
        settings={settings}
        state={state}
        statistics={statistics}
        test-id="videoControlBar"
        videoTrack={videoTrack}
      />
    </Box>
  );
};

export * from './types';
export default PublisherVideoView;
