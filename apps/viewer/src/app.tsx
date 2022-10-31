import { Box, Center, Flex, Heading, Spacer, VStack, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import useViewer from '@millicast-react/use-viewer';

function App() {
  const { viewerState, setupViewer, viewerStreams } = useViewer();

  useEffect(() => {
    const href = new URL(window.location.href);
    const streamName =
      href.searchParams.get('streamName') ?? import.meta.env.VITE_MILLICAST_STREAM_NAME;
    const streamAccountId =
      href.searchParams.get('streamAccountId') ?? import.meta.env.VITE_MILLICAST_STREAM_ID;
    setupViewer(streamName, streamAccountId);
    // TODO: return a clean up function which stops the viewer
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
            {viewerState === 'ready' ? (
              <Text> Please connect first </Text>
            ) : (
              // TODO: add more logic for streaming
              <Text> Presenter is not live now, please stay tuned. </Text>
            )}
          </VStack>
        </Center>
      </Box>
    </VStack>
  );
}

export default App;
