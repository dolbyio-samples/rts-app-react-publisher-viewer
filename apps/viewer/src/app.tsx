import { Box, Flex, Text, VStack } from '@chakra-ui/react';
import React, { useEffect } from 'react';

import InfoBar from '#millicast-react/info-bar';
import InfoLabel from '#millicast-react/info-label';
import useNotification from '#millicast-react/use-notification';
import usePageClosePrompt from '#millicast-react/use-page-close-prompt';
import useViewer from '#millicast-react/use-viewer';

import ViewerVideoTiles from './components/viewer-video-tiles';

import './styles/app.css';

const App = () => {
  const href = new URL(window.location.href);

  const streamName = href.searchParams.get('streamName') ?? import.meta.env.VITE_RTS_STREAM_NAME;
  const streamAccountId = href.searchParams.get('streamAccountId') ?? import.meta.env.VITE_RTS_ACCOUNT_ID;

  const { showError } = useNotification();
  // Prevent closing the page
  usePageClosePrompt();

  const {
    mainMediaStream,
    mainQualityOptions,
    mainStatistics,
    projectToMainStream,
    remoteTrackSources,
    reprojectFromMainStream,
    setSourceQuality,
    startViewer,
    stopViewer,
    viewerCount,
  } = useViewer({ handleError: showError, streamAccountId, streamName });

  useEffect(() => {
    startViewer();
    return () => {
      stopViewer();
    };
  }, []);

  const hasMultiStream = remoteTrackSources.size > 1;
  const isStreaming = remoteTrackSources.size > 0;

  return (
    <VStack background="background" height="100%" padding="24px" spacing="24px" width="100%">
      <VStack spacing="16px" width="100%">
        <InfoBar isActive={isStreaming} numViewers={viewerCount} title="Company name" />
        {hasMultiStream ? (
          <Flex justifyContent="flex-end" width="100%">
            <InfoLabel
              bgColor="dolbyNeutral.300"
              color="white"
              fontWeight="600"
              height="auto"
              padding="6px 18px"
              test-id="multiSource"
              text="Multi–stream view"
            />
          </Flex>
        ) : undefined}
      </VStack>
      <ViewerVideoTiles
        mainMediaStream={mainMediaStream}
        mainQualityOptions={mainQualityOptions}
        mainStatistics={mainStatistics}
        projectToMainStream={projectToMainStream}
        remoteTrackSources={remoteTrackSources}
        reprojectFromMainStream={reprojectFromMainStream}
        setSourceQuality={setSourceQuality}
      />
      <Box bottom="5px" left="5px" position="fixed" test-id="appVersion">
        <Text fontSize="12px">Version: {__APP_VERSION__}</Text>
      </Box>
    </VStack>
  );
};

export default App;
