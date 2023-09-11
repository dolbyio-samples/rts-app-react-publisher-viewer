import { Box, Flex, Text, VStack } from '@chakra-ui/react';
import React, { useEffect } from 'react';

import InfoBar from '@millicast-react/info-bar';
import InfoLabel from '@millicast-react/info-label';
import useNotification from '@millicast-react/use-notification';
import usePageClosePrompt from '@millicast-react/use-page-close-prompt';
import useViewer from '@millicast-react/use-viewer';

import ViewerVideoTiles from './components/viewer-video-tiles';
import { NoStream } from './components/no-stream';

import './styles/app.css';

const App = () => {
  const href = new URL(window.location.href);

  const streamName = href.searchParams.get('streamName') ?? import.meta.env.VITE_RTS_STREAM_NAME;
  const streamAccountId = href.searchParams.get('streamAccountId') ?? import.meta.env.VITE_RTS_ACCOUNT_ID;

  const { showError } = useNotification();
  usePageClosePrompt();

  const {
    mainMediaStream,
    mainSourceId,
    mainQualityOptions,
    mainStatistics,
    projectToMainStream,
    remoteTrackSources,
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

  return (
    <VStack background="background" height="100%" padding="24px" spacing="24px" width="100%">
      {mainMediaStream && mainSourceId ? (
        <ViewerVideoTiles
          mainMediaStream={mainMediaStream}
          mainSourceId={mainSourceId}
          mainQualityOptions={mainQualityOptions}
          mainStatistics={mainStatistics}
          projectToMainStream={projectToMainStream}
          remoteTrackSources={remoteTrackSources}
          setSourceQuality={setSourceQuality}
        />
      ) : (
        <NoStream />
      )}
      <Box bottom="5px" left="5px" position="fixed" test-id="appVersion" paddingTop="10px">
        <Text fontSize="12px">Version: {__APP_VERSION__}</Text>
      </Box>
    </VStack>
  );
};

export default App;
