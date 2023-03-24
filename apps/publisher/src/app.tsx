import { Box, Flex, Text, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

import InfoBar from '@millicast-react/info-bar';
import InfoLabel from '@millicast-react/info-label';
import useLocalFiles from '@millicast-react/use-local-files';
import useMediaDevices from '@millicast-react/use-media-devices';
import useNotification from '@millicast-react/use-notification';
import usePageClosePrompt from '@millicast-react/use-page-close-prompt';
import usePublisher from '@millicast-react/use-publisher';
import useScreenShare from '@millicast-react/use-screen-share';

import ActionBar from './components/action-bar';
import PublisherVideoTiles from './components/publisher-video-tiles';
import useMultiMediaStreams, { StreamTypes } from './hooks/use-multi-media-streams';

import './styles/app.css';

const TIMESTAMP_STREAM_NAME = new Date().valueOf().toString();

const { VITE_RTS_VIEWER_BASE_URL, VITE_RTS_ACCOUNT_ID, VITE_RTS_STREAM_NAME, VITE_RTS_STREAM_PUBLISHING_TOKEN } =
  import.meta.env;

const App = () => {
  const [allSourcesLive, setAllSourcesLive] = useState(false);

  const { showError } = useNotification();
  usePageClosePrompt();

  const localFiles = useLocalFiles();
  const mediaDevices = useMediaDevices({ handleError: showError });
  const screenShare = useScreenShare({ handleError: showError });

  const { applyConstraints, streams } = useMultiMediaStreams({
    localFiles: localFiles.files,
    mediaDevices: mediaDevices.mediaStreams,
    screenShare: screenShare.mediaStreams,
  });

  const {
    codecList,
    shareUrl,
    sources,
    startStreamingToSource,
    stopStreamingToSource,
    updateSourceBroadcastOptions,
    updateSourceMediaStream,
    viewerCount,
  } = usePublisher({
    handleError: showError,
    streamName: VITE_RTS_STREAM_NAME || TIMESTAMP_STREAM_NAME,
    streamNameId: VITE_RTS_ACCOUNT_ID,
    token: VITE_RTS_STREAM_PUBLISHING_TOKEN,
    viewerAppBaseUrl: VITE_RTS_VIEWER_BASE_URL,
    streams,
  });

  // Initialise first media device if no streams
  useEffect(() => {
    if (streams.size) {
      return;
    }

    const [initAudioDevice] = mediaDevices.audioDevices;
    const [initVideoDevice] = mediaDevices.videoDevices;

    if (initAudioDevice && initVideoDevice) {
      mediaDevices.start({
        audioDeviceId: initAudioDevice.deviceId,
        videoDeviceId: initVideoDevice.deviceId,
      });
    }
  }, [mediaDevices.videoDevices.length, mediaDevices.audioDevices.length, streams.size]);

  useEffect(() => {
    if (allSourcesLive) {
      sources.forEach((source, id) => {
        try {
          if (!source.publish.isActive()) {
            startStreamingToSource(id);
          }
        } catch (error) {
          showError(`Failed to start streaming: ${error}`);
        }
      });
    }
  }, [sources.size]);

  const handleRemoveSource = (id: string) => {
    if (sources.size <= 1) {
      return;
    }

    return () => {
      stopStreamingToSource(id);

      const stream = streams.get(id);

      switch (stream?.type) {
        case StreamTypes.DISPLAY:
          screenShare.stop(id);
          break;

        case StreamTypes.LOCAL:
          localFiles.remove(id);
          break;

        case StreamTypes.MEDIA:
          mediaDevices.stop(id);
          break;
      }
    };
  };

  const handleStartAllSources = () => {
    for (const id of sources.keys()) {
      try {
        startStreamingToSource(id);
      } catch (error) {
        showError(`Failed to start streaming: ${error}`);
      }
    }

    setAllSourcesLive(true);
  };

  const handleStartSource = (id: string, mediaStream?: MediaStream) => () => {
    startStreamingToSource(id, mediaStream);
  };

  const handleStopAllSources = () => {
    for (const id of sources.keys()) {
      stopStreamingToSource(id);
    }

    setAllSourcesLive(false);
  };

  const handleStopSource = (id: string) => () => {
    stopStreamingToSource(id);
    setAllSourcesLive(false);
  };

  const hasMultiStream = sources.size > 1;
  const isPublisherStreaming = Array.from(sources).some(([, { state }]) => state === 'streaming');

  return (
    <VStack
      background="background"
      height="100%"
      justifyContent="space-between"
      padding="24px"
      spacing="24px"
      width="100%"
    >
      <VStack spacing="16px" width="100%">
        <InfoBar isActive={isPublisherStreaming} numViewers={viewerCount} title="Company name" />
        {hasMultiStream ? (
          <Flex justifyContent="flex-end" width="100%">
            <InfoLabel
              bgColor="dolbyNeutral.300"
              color="white"
              fontWeight="600"
              h="auto"
              ml="2.5"
              py="5px"
              test-id="multiSource"
              text="Multi–stream view"
            />
          </Flex>
        ) : undefined}
      </VStack>
      <PublisherVideoTiles
        allSourcesLive={allSourcesLive}
        applyConstraints={applyConstraints}
        codecList={codecList}
        onRemoveSource={handleRemoveSource}
        onStartSource={handleStartSource}
        onStopSource={handleStopSource}
        sources={sources}
        streams={streams}
        updateSourceBroadcastOptions={updateSourceBroadcastOptions}
        updateSourceMediaStream={updateSourceMediaStream}
      />
      <ActionBar
        audioDevices={mediaDevices.audioDevices}
        onAddLocalFile={localFiles.add}
        onStartAllSources={handleStartAllSources}
        onStartMediaDevice={mediaDevices.start}
        onStartScreenShare={screenShare.start}
        onStopAllSources={handleStopAllSources}
        shareUrl={shareUrl}
        sources={sources}
        streams={streams}
        videoDevices={mediaDevices.videoDevices}
      />
      <Box bottom="5px" left="5px" position="fixed" test-id="appVersion">
        <Text fontSize="12px">Version: {__APP_VERSION__}</Text>
      </Box>
    </VStack>
  );
};

export default App;
