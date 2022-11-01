import { Box, Center, Flex, Heading, Spacer, VStack, Text, Button, HStack } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import useViewer from '@millicast-react/use-viewer';
import VideoView from '@millicast-react/video-view';

function App() {
  const { viewerState, setupViewer, stopViewer, connect, remoteTrackSources } = useViewer();
  useEffect(() => {
    const href = new URL(window.location.href);
    const streamName = href.searchParams.get('streamName') ?? import.meta.env.VITE_MILLICAST_STREAM_NAME;
    const streamAccountId = href.searchParams.get('streamAccountId') ?? import.meta.env.VITE_MILLICAST_STREAM_ID;
    setupViewer(streamName, streamAccountId);
    return stopViewer;
  }, []);

  return (
    <VStack w="100%">
      <Flex w="100%" gap="2" minWidth="max-content" alignItems="center">
        <Box>
          <Heading size="md" p="4">
            Dolbyio logo
          </Heading>
        </Box>
        <Spacer />
      </Flex>
      <Box>
        <Center>
          <VStack>
            {viewerState === 'ready' && (
              <>
                <Text> Please connect first </Text>
                <Button
                  onClick={() => {
                    connect();
                  }}
                >
                  connect
                </Button>
              </>
            )}
            {remoteTrackSources.size === 0 && <Text> No stream is live </Text>}
            <HStack>
              {Array.from(remoteTrackSources, ([id, source]) => ({ id, source })).map((trackSource) => {
                return (
                  <Box maxW="640" maxH="480px" key={trackSource.id}>
                    <VideoView mediaStream={trackSource.source.mediaStream} />
                  </Box>
                );
              })}
            </HStack>
          </VStack>
        </Center>
      </Box>
    </VStack>
  );
}

export default App;
