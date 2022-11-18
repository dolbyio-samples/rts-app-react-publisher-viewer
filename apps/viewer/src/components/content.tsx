import {
  VStack,
  Text,
  HStack,
  Flex,
  Spacer,
  Box,
  Heading,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Stack,
} from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import useViewer, { SimulcastQuality, StreamQuality } from '@millicast-react/use-viewer';
import { IconProfile, IconInfo, IconSettings, IconCameraOn } from '@millicast-react/dolbyio-icons';
import VideoView from '@millicast-react/video-view';
import ParticipantCount from '@millicast-react/participant-count';
import Timer from '@millicast-react/timer';
import IconButton from '@millicast-react/icon-button';
import ActionBar from '@millicast-react/action-bar';
// import ControlBar from '@millicast-react/control-bar';
import Dropdown from '@millicast-react/dropdown';
import StatisticsInfo from '@millicast-react/statistics-info';
import InfoLabel from '@millicast-react/info-label';

const Content = () => {
  const {
    viewerState,
    mainStream,
    setupViewer,
    stopViewer,
    startViewer,
    projectRemoteTrackToMain,
    remoteTrackSources,
    viewerCount,
    streamQualityOptions,
    updateStreamQuality,
    statistics,
  } = useViewer();

  const [selectedQuality, setSelectedQuality] = useState(streamQualityOptions[0]?.streamQuality);

  const projectingSourceId = useRef<string>('main');

  useEffect(() => {
    const href = new URL(window.location.href);
    const streamName = href.searchParams.get('streamName') ?? import.meta.env.VITE_MILLICAST_STREAM_NAME;
    const streamAccountId = href.searchParams.get('streamAccountId') ?? import.meta.env.VITE_MILLICAST_STREAM_ID;
    setupViewer(streamName, streamAccountId, projectingSourceId.current);
    return stopViewer;
  }, []);

  useEffect(() => {
    startViewer({ events: ['active', 'inactive', 'layers', 'viewercount'] });
  }, []);

  useEffect(() => {
    if (
      projectingSourceId.current &&
      remoteTrackSources.size > 0 &&
      !remoteTrackSources.get(projectingSourceId.current)
    ) {
      const newSourceId = remoteTrackSources.keys().next().value as string;
      projectRemoteTrackToMain(newSourceId);
    }
  }, [remoteTrackSources]);

  const isStreaming = viewerState === 'liveOn';
  const hasMultiStream = remoteTrackSources.size > 1;

  return (
    <Flex direction="column" minH="100vh" w="100vw" bg="background" p="6">
      <Box w="100%" h="94px">
        <ActionBar title="Company name" />
        <Flex w="100%" justifyContent="space-between" mt="4" position="relative" zIndex={1}>
          <Stack direction="column" spacing="4" alignItems="flex-start">
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
          </Stack>
          <Stack direction="column" spacing="4" alignItems="flex-end">
            {isStreaming && <ParticipantCount count={viewerCount} />}
          </Stack>
        </Flex>
      </Box>
      <Flex flex={1} width="100%" alignItems="center" justifyContent="center">
        {!isStreaming ? (
          <VStack>
            <Heading test-id="getStartedInfoTitle" as="h2" fontSize="24px" fontWeight="600">
              Stream is not live
            </Heading>
            <Text>Please wait for livestream to begin.</Text>
          </VStack>
        ) : (
          <Stack direction="row" justifyContent="center" alignItems="center" w="100%" spacing="6">
            {mainStream && (
              <Stack direction="column" justifyContent="center" alignItems="center" spacing={4}>
                <VideoView
                  width={hasMultiStream ? '688px' : '836px'}
                  height={hasMultiStream ? '382px' : '464px'}
                  muted={true}
                  mediaStream={mainStream}
                  displayFullscreenButton={false}
                  placeholderNode={
                    <Box color="dolbyNeutral.700" position="absolute" width="174px">
                      <IconProfile />
                    </Box>
                  }
                />
                {/* <VideoControlBar /> */}
              </Stack>
            )}
            {hasMultiStream && (
              <Stack direction="column" spacing={4}>
                {Array.from(remoteTrackSources, ([id, source]) => ({ id, source })).map((trackSource) => {
                  if (trackSource.id !== 'main') {
                    return (
                      <VideoView
                        key={trackSource.id}
                        width="688px"
                        height="382px"
                        mediaStream={trackSource.source.mediaStream}
                      />
                    );
                  }
                  return null;
                })}
                {/* <ControlBar
                controls={[
                  {
                    key: 'stopScreenShare',
                    'test-id': 'stopScreenShare',
                    tooltip: { label: 'Stop screen share', placement: 'top' },
                    onClick: stopDisplayCapture,
                    icon: <IconClose width="16px" />,
                    reversed: true,
                  },
                ]}
              /> */}
              </Stack>
            )}
          </Stack>
        )}
      </Flex>
      <HStack alignItems="center" w="96%" h="48px" pos="fixed" bottom="32px">
        <Box>
          {isStreaming && statistics && (
            <Popover placement="top-end">
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
          {isStreaming && streamQualityOptions.length > 1 && (
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
                  />
                </PopoverBody>
              </PopoverContent>
            </Popover>
          )}
        </Flex>
      </HStack>
      <Box test-id="appVersion" position="fixed" bottom="5px" left="5px">
        <Text fontSize="12px">Version: {__APP_VERSION__} </Text>
      </Box>
    </Flex>
  );
};

export default Content;
