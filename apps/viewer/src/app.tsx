import { Box, Center, Flex, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { StreamStats } from '@millicast/sdk';
import React, { useCallback, useEffect, useState } from 'react';

import ActionBar from '@millicast-react/action-bar';
import { IconProfile } from '@millicast-react/dolbyio-icons';
import InfoLabel from '@millicast-react/info-label';
import ParticipantCount from '@millicast-react/participant-count';
import Timer from '@millicast-react/timer';
import useNotification from '@millicast-react/use-notification';
import useViewer, { SimulcastQuality } from '@millicast-react/use-viewer';

import ViewerVideoView from './components/viewer-video-view';

import './styles/font.css';

const MAX_SOURCES = 4;

const App = () => {
  const href = new URL(window.location.href);

  const streamName = href.searchParams.get('streamName') ?? import.meta.env.VITE_RTS_STREAM_NAME;
  const streamAccountId = href.searchParams.get('streamAccountId') ?? import.meta.env.VITE_RTS_ACCOUNT_ID;

  const { showError } = useNotification();

  const {
    mainMediaStream,
    projectToMainStream,
    remoteTrackSources,
    reprojectFromMainStream,
    setSourceQuality,
    startViewer,
    stopViewer,
    viewerCount,
  } = useViewer({ handleError: showError, streamAccountId, streamName });

  const [mainSourceId, setMainSourceId] = useState<string>();

  // Prevent closing the page
  useEffect(() => {
    const pageCloseHandler = (event: BeforeUnloadEvent) => {
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', pageCloseHandler);

    return () => {
      window.removeEventListener('beforeunload', pageCloseHandler);
    };
  }, []);

  useEffect(() => {
    startViewer();
    return () => {
      stopViewer();
    };
  }, []);

  // Assign the first source as the initial main stream
  useEffect(() => {
    if (!remoteTrackSources.size) {
      return;
    }

    if (!mainSourceId || !remoteTrackSources.get(mainSourceId)) {
      const [[firstSourceId]] = remoteTrackSources;

      changeMainSource(firstSourceId);
    }
  }, [remoteTrackSources.size]);

  const mainSource = mainSourceId !== undefined ? remoteTrackSources.get(mainSourceId) : undefined;

  const changeMainSource = async (sourceId: string) => {
    const { sourceId: prevSourceId } = mainSource ?? {};

    if (prevSourceId) {
      reprojectFromMainStream(prevSourceId);
    }

    projectToMainStream(sourceId).then(() => {
      setMainSourceId(sourceId);
      // Reset quality
      setSourceQuality(sourceId, { streamQuality: 'Auto' });
    });
  };

  const mainSourceSettings = useCallback(() => {
    if (!mainSource) {
      return {};
    }

    const { quality, sourceId, streamQualityOptions } = mainSource;

    return {
      quality: {
        handleSelect: (data: unknown) => {
          setSourceQuality(sourceId, data as SimulcastQuality);
        },
        options: streamQualityOptions,
        value: quality ?? '',
      },
    };
  }, [mainSource]);

  const hasMultiStream = remoteTrackSources.size > 1;
  const isStreaming = remoteTrackSources.size > 0;

  return (
    <Flex bg="background" direction="column" height="100vh" maxHeight="100vh" p={6} width="100vw">
      <Box height="94px" width="100%">
        <ActionBar title="Company name" />
        <Flex justifyContent="space-between" mt="4" position="relative" w="100%" zIndex={1}>
          <VStack alignItems="flex-start" spacing="4">
            <Flex alignItems="center">
              <Timer isActive={isStreaming} />
              {hasMultiStream && (
                <InfoLabel
                  bgColor="dolbyNeutral.300"
                  color="white"
                  fontWeight="600"
                  h="auto"
                  ml="2.5"
                  py="5px"
                  text="Multi–stream view"
                />
              )}
            </Flex>
            {isStreaming && viewerCount > 0 && <ParticipantCount count={viewerCount} />}
          </VStack>
        </Flex>
      </Box>
      <Flex alignItems="center" flex={1} justifyContent="center" width="100%">
        {!isStreaming ? (
          <VStack>
            <Heading as="h2" fontSize="24px" fontWeight="600" test-id="pageHeader">
              Stream is not live
            </Heading>
            <Text test-id="pageDesc">Please wait for livestream to begin.</Text>
          </VStack>
        ) : (
          <HStack height="573px" justifyContent="center" maxHeight="573px" width="100vw">
            <Box height="100%" maxWidth="90vw" test-id="millicastVideo" width="80vw">
              <ViewerVideoView
                isStreaming={isStreaming}
                settings={mainSourceSettings()}
                showControlBar
                statistics={mainSource?.statistics as StreamStats}
                videoProps={{
                  displayVideo: true,
                  label: mainSourceId,
                  mediaStream: mainMediaStream,
                  placeholderNode: (
                    <Center
                      background="dolbyNeutral.800"
                      color="dolbyNeutral.700"
                      height="100%"
                      position="absolute"
                      width="100%"
                    >
                      <IconProfile height="174px" width="174px" />
                    </Center>
                  ),
                }}
              />
            </Box>
            {remoteTrackSources.size > 1 ? (
              <VStack height="100%" maxWidth="20vw">
                {Array.from(remoteTrackSources)
                  .filter(([sourceId]) => sourceId !== mainSourceId)
                  .map(([sourceId, { mediaStream }]) => (
                    <Box
                      cursor="pointer"
                      height={`calc(100% / (${MAX_SOURCES} - 1))`}
                      key={sourceId}
                      onClick={() => {
                        changeMainSource(sourceId);
                      }}
                      test-id="millicastVideo"
                      width="100%"
                    >
                      <ViewerVideoView
                        isStreaming={isStreaming}
                        videoProps={{
                          displayVideo: true,
                          label: sourceId,
                          mediaStream,
                          muted: true,
                        }}
                      />
                    </Box>
                  ))}
              </VStack>
            ) : undefined}
          </HStack>
        )}
      </Flex>
      <Box bottom="5px" left="5px" position="fixed" test-id="appVersion">
        <Text fontSize="12px">Version: {__APP_VERSION__} </Text>
      </Box>
    </Flex>
  );
};

export default App;
