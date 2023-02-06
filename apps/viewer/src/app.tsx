import { Box, Flex, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { StreamStats } from '@millicast/sdk';
import React, { useCallback, useEffect, useState } from 'react';

import ActionBar from '@millicast-react/action-bar';
import InfoLabel from '@millicast-react/info-label';
import ParticipantCount from '@millicast-react/participant-count';
import Timer from '@millicast-react/timer';
import useNotification from '@millicast-react/use-notification';
import useViewer, { SimulcastQuality } from '@millicast-react/use-viewer';

import ViewerVideoView from './components/viewer-video-view';

import './styles/font.css';

const MAX_SOURCES = 4;

function App() {
  const href = new URL(window.location.href);

  const streamName = href.searchParams.get('streamName') ?? import.meta.env.VITE_RTS_STREAM_NAME;
  const streamAccountId = href.searchParams.get('streamAccountId') ?? import.meta.env.VITE_RTS_ACCOUNT_ID;

  const { showError } = useNotification();

  const {
    mainMediaStream,
    projectToMainStream,
    remoteTrackSources,
    setSourceQuality,
    startViewer,
    stopViewer,
    viewerCount,
  } = useViewer({ streamName, streamAccountId, handleError: showError });

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
    if (remoteTrackSources.size && !mainSourceId) {
      const [[firstSourceId]] = remoteTrackSources;

      setMainSourceId(firstSourceId);
    }
  }, [remoteTrackSources.size]);

  useEffect(() => {
    if (mainSourceId) {
      projectToMainStream(mainSourceId);
    }
  }, [mainSourceId]);

  const handleClickVideo = (sourceId: string) => {
    setMainSourceId(sourceId);
  };

  const mainSource = mainSourceId !== undefined ? remoteTrackSources.get(mainSourceId) : undefined;

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
      <Box w="100%" h="94px">
        <ActionBar title="Company name" />
        <Flex w="100%" justifyContent="space-between" mt="4" position="relative" zIndex={1}>
          <VStack spacing="4" alignItems="flex-start">
            <Flex alignItems="center">
              <Timer isActive={isStreaming} />
              {hasMultiStream && (
                <InfoLabel
                  text="Multi–stream view"
                  ml="2.5"
                  color="white"
                  bgColor="dolbyNeutral.300"
                  py="5px"
                  h="auto"
                  fontWeight="600"
                />
              )}
            </Flex>
            {isStreaming && viewerCount > 0 && <ParticipantCount count={viewerCount} />}
          </VStack>
        </Flex>
      </Box>
      <Flex flex={1} width="100%" alignItems="center" justifyContent="center">
        {!isStreaming ? (
          <VStack>
            <Heading test-id="pageHeader" as="h2" fontSize="24px" fontWeight="600">
              Stream is not live
            </Heading>
            <Text test-id="pageDesc">Please wait for livestream to begin.</Text>
          </VStack>
        ) : (
          <HStack height="573px" maxHeight="573px">
            <Box height="100%" test-id="millicastVideo">
              <ViewerVideoView
                isActive={isStreaming}
                settingsProps={mainSourceSettings()}
                statistics={mainSource?.statistics as StreamStats}
                videoProps={{
                  // TODO: hide video
                  // displayVideo: !hideVideo,
                  displayVideo: true,
                  mediaStream: mainMediaStream,
                  // TODO: mute audio
                  // muted: muteAudio,
                }}
              />
            </Box>
            <VStack height="100%">
              {Array.from(remoteTrackSources).map(([sourceId, { mediaStream }]) => (
                <Box
                  cursor="pointer"
                  height={`calc(100% / ${MAX_SOURCES})`}
                  key={sourceId}
                  onClick={() => {
                    handleClickVideo(sourceId);
                  }}
                  test-id="millicastVideo"
                  width="100%"
                >
                  <ViewerVideoView
                    isActive={isStreaming}
                    videoProps={{
                      displayVideo: true,
                      mediaStream,
                      muted: true,
                    }}
                  />
                </Box>
              ))}
            </VStack>
          </HStack>
        )}
      </Flex>
      <Box test-id="appVersion" position="fixed" bottom="5px" left="5px">
        <Text fontSize="12px">Version: {__APP_VERSION__} </Text>
      </Box>
    </Flex>
  );
}

export default App;
