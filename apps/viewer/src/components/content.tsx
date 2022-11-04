import { Box, Center, VStack, Text, Button, HStack, Flex, Spacer, Select } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import useViewer, { StreamQuality } from '@millicast-react/use-viewer';
import VideoView from '@millicast-react/video-view';
import ParticipantCount from '@millicast-react/participant-count';

const Content = () => {
  const {
    viewerState,
    mainStream,
    setupViewer,
    stopViewer,
    startViewer,
    remoteTrackSources,
    viewerCount,
    streamQuality,
    streamQualityOptions,
    updateStreamQuality,
  } = useViewer();
  useEffect(() => {
    const href = new URL(window.location.href);
    const streamName = href.searchParams.get('streamName') ?? import.meta.env.VITE_MILLICAST_STREAM_NAME;
    const streamAccountId = href.searchParams.get('streamAccountId') ?? import.meta.env.VITE_MILLICAST_STREAM_ID;
    setupViewer(streamName, streamAccountId);
    return stopViewer;
  }, []);

  return (
    <Box width="100vw">
      <Flex pr="4">
        <Spacer />
        {viewerState === 'liveOn' && <ParticipantCount count={viewerCount} />}
      </Flex>
      <Center>
        <VStack>
          {viewerState === 'ready' && (
            <>
              <Text> Please connect first </Text>
              <Button
                onClick={() => {
                  startViewer({ events: ['active', 'inactive', 'layers', 'stopped', 'viewercount'] });
                }}
              >
                connect
              </Button>
            </>
          )}
          <HStack>
            {mainStream && viewerState === 'liveOn' ? (
              <VideoView mediaStream={mainStream} muted={false} />
            ) : (
              <Text> No stream is live </Text>
            )}
            <VStack>
              {Array.from(remoteTrackSources, ([id, source]) => ({ id, source })).map((trackSource) => {
                return (
                  <Box maxW="640" maxH="480px" key={trackSource.id}>
                    <VideoView mediaStream={trackSource.source.mediaStream} />
                  </Box>
                );
              })}
            </VStack>
          </HStack>
          {viewerState === 'liveOn' && streamQualityOptions.length > 1 ? (
            <Select
              test-id="simulcastQualitySelect"
              defaultValue={streamQuality}
              onChange={(e) => updateStreamQuality(e.target.value as StreamQuality)}
            >
              {streamQualityOptions.map((option) => {
                return (
                  <option key={option.streamQuality} value={option.streamQuality}>
                    {option.streamQuality}
                  </option>
                );
              })}
              ;
            </Select>
          ) : undefined}
        </VStack>
      </Center>
    </Box>
  );
};

export default Content;
