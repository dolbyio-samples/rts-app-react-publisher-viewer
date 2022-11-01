import { Box, Center, Flex, Heading, Spacer, VStack, Text, Button } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import useViewer from '@millicast-react/use-viewer';
import VideoView from '@millicast-react/video-view';

function App() {
  const { viewerState, setupViewer, stop, viewerStreams, connect, project, viewerMediaSources } = useViewer();
  useEffect(() => {
    const href = new URL(window.location.href);
    const streamName = href.searchParams.get('streamName') ?? import.meta.env.VITE_MILLICAST_STREAM_NAME;
    const streamAccountId = href.searchParams.get('streamAccountId') ?? import.meta.env.VITE_MILLICAST_STREAM_ID;
    setupViewer(streamName, streamAccountId);
    return stop;
  }, []);

  useEffect(() => {
    // TODO: play the selected source by user instead of the first
    // this should not run if it's not multi-source broadcast
    if (viewerStreams.length && viewerMediaSources.length) {
      project(viewerMediaSources[0].sourceId);
    }
  }, [viewerStreams, viewerMediaSources]);

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
                    // todo: get pinnedSourceId from URL param, then connect({ pinnedSourceId: 'PresenterMedia' });
                  }}
                >
                  connect
                </Button>
              </>
            )}
            {viewerStreams && viewerStreams.length ? (
              <VideoView mirrored={false} mediaStream={viewerStreams[0]} />
            ) : (
              <Text> No stream </Text>
            )}
          </VStack>
        </Center>
      </Box>
    </VStack>
  );
}

export default App;
