import { Box } from '@chakra-ui/react';
import React, { useRef } from 'react';

import VideoView from '@millicast-react/video-view';

import { ViewerVideoViewProps } from './types';
import VideoControlBar from './video-control-bar';

const ViewerVideoView = ({ isActive, settings, showControlBar, statistics, videoProps }: ViewerVideoViewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

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
      <VideoView {...videoProps} ref={videoRef} />
      {showControlBar ? (
        <VideoControlBar
          audioTrack={audioTrack}
          isActive={isActive}
          opacity={0}
          settings={settings}
          statistics={statistics}
          test-id="videoControlBar"
          video={videoRef?.current}
          videoTrack={videoTrack}
        />
      ) : undefined}
    </Box>
  );
};

export * from './types';
export default ViewerVideoView;
