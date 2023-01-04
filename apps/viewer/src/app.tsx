import { Box, Flex, HStack, Heading, Text, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

import ActionBar from '@millicast-react/action-bar';
import ControlBar from '@millicast-react/control-bar';
import { IconCameraOff, IconCameraOn, IconSpeaker, IconSpeakerOff } from '@millicast-react/dolbyio-icons';
import InfoLabel from '@millicast-react/info-label';
import ParticipantCount from '@millicast-react/participant-count';
import Timer from '@millicast-react/timer';
import useNotification from '@millicast-react/use-notification';
import useViewer from '@millicast-react/use-viewer';

import ViewerVideoView from './components/viewer-video-view';

import './styles/font.css';

type TrackSourceState = {
  muteAudio: boolean;
  hideVideo: boolean;
};

type TrackSourcesStates = Map<string, TrackSourceState>;

function App() {
  const [trackSourcesStates, setTrackSourcesStates] = useState<TrackSourcesStates>(new Map());

  useEffect(() => {
    // prevent closing the page
    const pageCloseHandler = (event: BeforeUnloadEvent) => {
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', pageCloseHandler);

    return () => {
      window.removeEventListener('beforeunload', pageCloseHandler);
    };
  }, []);

  const { showError } = useNotification();
  const href = new URL(window.location.href);
  const streamName = href.searchParams.get('streamName') ?? import.meta.env.VITE_MILLICAST_STREAM_NAME;
  const streamAccountId = href.searchParams.get('streamAccountId') ?? import.meta.env.VITE_MILLICAST_STREAM_ID;
  const {
    startViewer,
    stopViewer,
    remoteTrackSources,
    viewerCount,
    // updateSourceQuality: updateStreamQuality,
  } = useViewer({
    streamName,
    streamAccountId,
    handleError: showError,
  });

  // const [selectedQuality, setSelectedQuality] = useState(streamQualityOptions[0]?.streamQuality);
  // const [mainStreamMuted, setMainStreamMuted] = useState(true);
  // const [mainStreamDisplayVideo, setMainStreamDisplayVideo] = useState(true);
  // TODO: map to remote track sources
  // const [displayStreamMuted, setDisplayStreamMuted] = useState(true);
  // const [displayStreamDisplayVideo, setDisplayStreamDisplayVideo] = useState(true);

  const isStreaming = remoteTrackSources.size > 0;
  const hasMultiStream = remoteTrackSources.size > 1;

  useEffect(() => {
    startViewer();
    return () => {
      stopViewer();
    };
  }, []);

  useEffect(() => {
    const newTrackSourcesStates = new Map(trackSourcesStates);
    remoteTrackSources.forEach((source) => {
      if (!newTrackSourcesStates.get(source.sourceId)) newTrackSourcesStates.delete(source.sourceId);
    });
    if (newTrackSourcesStates.size !== trackSourcesStates.size) {
      setTrackSourcesStates(newTrackSourcesStates);
    }
  }, [remoteTrackSources]);

  return (
    <Flex direction="column" minH="100vh" w="100vw" bg="background" p="6">
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
          <HStack justifyContent="center" alignItems="center" w="100%" spacing="6">
            {Array.from(remoteTrackSources, ([id, source]) => ({ id, source })).map(({ id, source }) => {
              const muteAudio = trackSourcesStates.get(id)?.muteAudio ?? true;
              const hideVideo = trackSourcesStates.get(id)?.hideVideo ?? false;
              const settings = {
                quality: {
                  // TODO: set quality
                  handleSelect: () => null,
                  options: source.streamQualityOptions,
                  // TODO: current quality
                  value: '',
                },
              };
              return (
                <VStack key={id}>
                  <ViewerVideoView
                    settingsProps={settings}
                    videoProps={{
                      displayVideo: !hideVideo,
                      height: '382px',
                      mediaStream: source.mediaStream,
                      muted: muteAudio,
                      width: '688px',
                    }}
                  />
                  <ControlBar
                    controls={[
                      {
                        key: `toggle${id}AudioButton`,
                        'test-id': `toggle${id}AudioButton`,
                        tooltip: { label: 'Toggle Audio', placement: 'top' },
                        onClick: () => {
                          const state = trackSourcesStates.get(id);
                          if (!state) return;
                          const newState = { ...state };
                          newState.muteAudio = !newState.muteAudio;
                          const newStates = new Map(trackSourcesStates);
                          newStates.set(id, newState);
                          setTrackSourcesStates(newStates);
                        },
                        isActive: muteAudio,
                        icon: muteAudio ? <IconSpeakerOff /> : <IconSpeaker />,
                      },
                      {
                        key: `toggle${id}VideoButton`,
                        'test-id': `toggle${id}VideoButton`,
                        tooltip: { label: 'Toggle Video', placement: 'top' },
                        onClick: () => {
                          const state = trackSourcesStates.get(id);
                          if (!state) return;
                          const newState = { ...state };
                          newState.hideVideo = !newState.hideVideo;
                          const newStates = new Map(trackSourcesStates);
                          newStates.set(id, newState);
                          setTrackSourcesStates(newStates);
                        },
                        isActive: hideVideo,
                        icon: hideVideo ? <IconCameraOff /> : <IconCameraOn />,
                      },
                    ]}
                  />
                </VStack>
              );
            })}
          </HStack>
        )}
      </Flex>
      {/* <HStack alignItems="center" w="96%" h="48px" pos="fixed" bottom="32px">
        <Box>
          {isStreaming && statistics && (
            <Popover placement="top-end" closeOnBlur={false} closeOnEsc={false}>
              <PopoverTrigger>
                <Box>
                  <IconButton
                    test-id="streamInfoButton"
                    aria-label="Stream Information"
                    tooltip={{ label: 'Stream Information' }}
                    size="md"
                    className="icon-button"
                    icon={<IconInfo fill="white" />}
                    borderRadius="50%"
                    reversed
                  />
                </Box>
              </PopoverTrigger>
              <PopoverContent bg="dolbyNeutral.800" width="400px" border="none" p={6}>
                <PopoverHeader
                  color="white"
                  alignContent="flex-start"
                  border="none"
                  p={0}
                  fontSize="20px"
                  fontWeight="600"
                  mb={4}
                >
                  Streaming Information
                </PopoverHeader>
                <PopoverCloseButton fontSize="20px" color="white" top={4} right={4} />
                <PopoverBody p={0}>
                  <StatisticsInfo statistics={statistics} />
                </PopoverBody>
              </PopoverContent>
            </Popover>
          )}
        </Box>
        <Spacer />
        <Flex direction="row" gap={2} justifyContent="flex-end" alignItems="center">
          {isStreaming && (
            <Popover placement="top-end">
              <PopoverTrigger>
                <Box>
                  <IconButton
                    test-id="settingsButton"
                    tooltip={{ label: 'Settings' }}
                    icon={<IconSettings />}
                    borderRadius="50%"
                    reversed
                  />
                </Box>
              </PopoverTrigger>
              <PopoverContent bg="dolbyNeutral.800" width="364px" border="none" p={6}>
                <PopoverHeader
                  color="white"
                  alignContent="flex-start"
                  border="none"
                  p={0}
                  fontSize="20px"
                  fontWeight="600"
                  mb={4}
                >
                  Settings
                </PopoverHeader>
                <PopoverCloseButton fontSize="20px" color="white" top={4} right={4} />
                <PopoverBody p={0}>
                  <Dropdown
                    leftIcon={<IconCameraOn />}
                    testId="quality-select"
                    elementsList={streamQualityOptions}
                    elementResolver={(element) => {
                      const quality = element as SimulcastQuality;
                      return {
                        id: quality.streamQuality,
                        label: quality.streamQuality,
                        data: quality.streamQuality,
                      };
                    }}
                    onSelect={(data) => {
                      updateStreamQuality(data as StreamQuality);
                      setSelectedQuality(data as StreamQuality);
                    }}
                    selected={selectedQuality}
                    placeholder="Video quality"
                    disabled={streamQualityOptions.length < 2}
                  />
                </PopoverBody>
              </PopoverContent>
            </Popover>
          )}
        </Flex>
      </HStack> */}
      <Box test-id="appVersion" position="fixed" bottom="5px" left="5px">
        <Text fontSize="12px">Version: {__APP_VERSION__} </Text>
      </Box>
    </Flex>
  );
}

export default App;
