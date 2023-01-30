import {
  Box,
  Flex,
  HStack,
  Heading,
  Spacer,
  Stack,
  Text,
  useDisclosure,
  VStack,
  Wrap,
  WrapItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Button,
  Center,
} from '@chakra-ui/react';
import { Event, VideoCodec } from '@millicast/sdk';
import React, { useEffect, useMemo, useState } from 'react';

import ActionBar from '@millicast-react/action-bar';
import DeviceSelection from '@millicast-react/device-selection';
import { IconAddCamera, IconPresent, IconProfile, IconStreamLocal } from '@millicast-react/dolbyio-icons';
import InfoLabel from '@millicast-react/info-label';
import LiveIndicator from '@millicast-react/live-indicator';
import ParticipantCount from '@millicast-react/participant-count';
import PopupMenu from '@millicast-react/popup-menu';
import ShareLinkButton from '@millicast-react/share-link-button';
import Timer from '@millicast-react/timer';
import useMultiMediaStreams, { bitrateList, Resolution, StreamTypes } from '@millicast-react/use-multi-media-streams';
import useNotification from '@millicast-react/use-notification';
import usePublisher from '@millicast-react/use-publisher';
import useLocalFile from '@millicast-react/use-local-file';
import PublisherVideoView from './components/publisher-video-view';
import './styles/font.css';

const MAX_SOURCES = 4;

const {
  VITE_MILLICAST_VIEWER_BASE_URL,
  VITE_MILLICAST_STREAM_ID,
  VITE_MILLICAST_STREAM_NAME,
  VITE_MILLICAST_STREAM_PUBLISHING_TOKEN,
} = import.meta.env;

const App = () => {
  const {
    isOpen: isDeviceSelectionOpen,
    onOpen: handleOpenDeviceSelection,
    onClose: handleCloseDeviceSelection,
  } = useDisclosure();

  const {
    isOpen: isFileSelectModalOpen,
    onOpen: onFileSelectModalOpen,
    onClose: onFileSelectModalClose,
  } = useDisclosure();

  const [newCamera, setNewCamera] = useState<InputDeviceInfo>();
  const [newMicrophone, setNewMicrophone] = useState<InputDeviceInfo>();

  const { localFile, register } = useLocalFile();
  const { showError } = useNotification();

  const {
    addStream,
    applyConstraints,
    cameraList,
    codecList,
    initDefaultStream,
    microphoneList,
    // TODO: remove and reset streams
    // removeStream,
    // reset,
    streams,
    // TODO: per-stream audio/video toggling
    // toggleAudio,
    // toggleVideo,
    updateStream,
  } = useMultiMediaStreams();

  const {
    shareUrl,
    sources,
    startStreamingToSource,
    stopStreamingToSource,
    updateSourceBitrate,
    updateSourceMediaStream,
    viewerCount,
  } = usePublisher({
    handleError: showError,
    streamId: VITE_MILLICAST_STREAM_ID,
    streamName: VITE_MILLICAST_STREAM_NAME || new Date().valueOf().toString(),
    token: VITE_MILLICAST_STREAM_PUBLISHING_TOKEN,
    viewerAppBaseUrl: VITE_MILLICAST_VIEWER_BASE_URL,
  });

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

  // Initialise default media device if no streams
  useEffect(() => {
    if (!streams.size) {
      initDefaultStream();
    }
  }, [cameraList.length, microphoneList.length, streams.size]);

  // Update default device selection values
  useEffect(() => {
    if (isDeviceSelectionOpen && cameraList.length > 0 && microphoneList.length > 0) {
      setNewCamera(cameraList[0]);
      setNewMicrophone(microphoneList[0]);
    }
  }, [isDeviceSelectionOpen, cameraList, microphoneList]);

  const addFileSource = () => {
    if (localFile) {
      addStream({ type: StreamTypes.LOCAL, ...localFile });
    }

    onFileSelectModalClose();
  };

  const addNewDevice = async () => {
    if (!newCamera || newMicrophone) {
      return;
    }

    if (sources.size < MAX_SOURCES) {
      await addStream({
        camera: newCamera,
        label: newCamera.label,
        microphone: newMicrophone,
        type: StreamTypes.MEDIA,
      });

      handleCloseDeviceSelection();

      setNewCamera(undefined);
      setNewMicrophone(undefined);
    }
  };

  const handleChangeLabel = (streamId: string, newLabel: string) => {
    const stream = streams.get(streamId);

    if (!stream) {
      return;
    }

    const allLabels = Array.from(streams)
      .filter(([id]) => id !== streamId)
      .map(([, { label }]) => label);

    console.log({ allLabels });

    let dedupedLabel = newLabel;

    if (allLabels.includes(newLabel)) {
      dedupedLabel = newLabel.replace(/\((?<dupeCounter>\d+)\)$|$/, (match, dupeCounter) => {
        if (!match) {
          return ' (2)';
        }

        return `(${parseInt(dupeCounter, 10) + 1})`;
      });
    }

    updateStream(streamId, { label: dedupedLabel });
  };

  const handleSelectBitrate = (streamId: string, newBitrate: number) => {
    const stream = streams.get(streamId);

    if (!stream) {
      return;
    }

    if (sources.get(stream.label)) {
      updateSourceBitrate(stream.label, newBitrate);
    }

    updateStream(streamId, { bitrate: newBitrate });
  };

  const handleSelectCodec = (streamId: string, newCodec: VideoCodec) => {
    const stream = streams.get(streamId);

    if (!stream || sources.get(stream.label)) {
      return;
    }

    updateStream(streamId, { codec: newCodec });
  };

  const handleSelectVideoResolution = async (id: string, resolution: Resolution) => {
    await applyConstraints(id, { videoConstraints: { height: resolution.height, width: resolution.width } });
  };

  const handleSetSimulcast = (streamId: string, newSimulcast: boolean) => {
    const stream = streams.get(streamId);

    if (!stream || sources.get(stream.label)) {
      return;
    }

    updateStream(streamId, { simulcast: newSimulcast });
  };

  const handleStartDisplayCapture = async () => {
    if (sources.size < MAX_SOURCES) {
      await addStream({ type: StreamTypes.DISPLAY });
    }
  };

  const handleStartLive = () => {
    if (streams.size) {
      streams.forEach((stream) => {
        const { bitrate, codec, label, mediaStream, simulcast } = stream;

        try {
          startStreamingToSource({
            bandwidth: bitrate,
            codec,
            events: ['viewercount'] as Event[],
            mediaStream,
            simulcast,
            sourceId: label,
          });
        } catch (error) {
          showError(`Failed to start streaming: ${error}`);
        }
      });
    }
  };

  // TODO: const handleStopDisplayCapture = () => {}

  const handleStopLive = () => {
    for (const sourceId of sources.keys()) {
      stopStreamingToSource(sourceId);
    }
  };

  const settings = (streamId: string) => {
    const stream = streams.get(streamId);

    if (!stream) {
      return {};
    }

    const { bitrate, codec, label, resolutions, simulcast, settings, type } = stream;
    const { height, width } = settings?.camera ?? {};
    const source = sources.get(label);

    const codecListSimulcast = simulcast ? codecList.filter((item) => item !== 'vp9') : codecList;
    const isConnecting = source?.state === 'connecting';
    const resolution = `${width}x${height}`;

    return {
      bitrate: {
        handleSelect: (data: unknown) => {
          handleSelectBitrate(streamId, data as number);
        },
        isDisabled: isConnecting,
        isHidden: !bitrateList.length,
        options: bitrateList,
        value: bitrateList.find(({ value }) => value === bitrate)?.name ?? bitrateList[0].name,
      },
      codec: {
        handleSelect: (data: unknown) => {
          handleSelectCodec(streamId, data as VideoCodec);
        },
        isDisabled: !!source,
        isHidden: !!source || !codecList.length,
        options: codecListSimulcast,
        value: codec ?? codecList[0],
      },
      name: {
        handleChange: (data: unknown) => {
          // TODO: debounce this
          handleChangeLabel(streamId, data as string);
        },
        isDisabled: !!source,
        isHidden: !!source,
        value: label,
      },
      resolution: {
        handleSelect: (data: unknown) => {
          handleSelectVideoResolution(streamId, data as Resolution);
        },
        isDisabled: type === StreamTypes.DISPLAY || isPublisherConnecting,
        isHidden: type === StreamTypes.DISPLAY,
        options: resolutions ?? [],
        value: resolution,
      },
      simulcast: {
        handleToggle: () => {
          handleSetSimulcast(streamId, !simulcast);
        },
        isDisabled: !!source,
        isHidden: !!source || codec === 'vp9',
        value: !!simulcast,
      },
    };
  };

  const isPublisherConnecting = Array.from(sources).some(([, { state }]) => state === 'connecting');
  const isPublisherStreaming = Array.from(sources).some(([, { state }]) => state === 'streaming');

  const [maxHeight, maxWidth] = useMemo(() => {
    switch (streams.size) {
      case 1:
        return ['564px', '1035px'];
      case 2:
        return ['382px', '688px'];
      default:
        return ['282px', '508px'];
    }
  }, [streams.size]);

  return (
    <VStack bg="background" minH="100vh" p="6" w="100vw">
      <Box h="146px" w="100%">
        <ActionBar title="Company name" />
        <Flex justifyContent="space-between" mt="4" position="relative" w="100%" zIndex={1}>
          <Stack alignItems="flex-start" direction="column" spacing="4">
            <Flex alignItems="center">
              <Timer isActive={isPublisherStreaming} />
              {sources.size > 1 && (
                <InfoLabel
                  bgColor="dolbyNeutral.300"
                  color="white"
                  fontWeight="600"
                  h="auto"
                  ml="2.5"
                  py="5px"
                  test-id="multiSource"
                  text="Multisource enabled"
                />
              )}
            </Flex>
            <LiveIndicator
              disabled={!streams.size}
              isActive={isPublisherStreaming}
              isLoading={isPublisherConnecting}
              start={handleStartLive}
              stop={handleStopLive}
            />
          </Stack>
          <Stack alignItems="flex-end" direction="column" spacing="4">
            {shareUrl && <ShareLinkButton linkText={shareUrl} tooltip={{ placement: 'top' }} />}
            {isPublisherStreaming && <ParticipantCount count={viewerCount} />}
          </Stack>
        </Flex>
      </Box>
      <Flex alignItems="center" position="relative" pt="20px" width="100%">
        {!isPublisherStreaming && (
          <VStack left="50%" position="absolute" top="0" transform="translate(-50%, -110%)">
            <Heading as="h2" fontSize="24px" fontWeight="600" test-id="pageHeader">
              Get started
            </Heading>
            <Text test-id="pageDesc">Setup your audio and video before going live.</Text>
          </VStack>
        )}
        <Wrap justify="center" margin="0 auto" maxWidth="1388px" spacing="12px" width="100%">
          {Array.from(streams).map(([streamId, stream]) => {
            const { label, mediaStream, type } = stream;
            const { state, statistics } = sources.get(label) ?? {};

            const flexBasis = streams.size > 1 ? 'calc(50% - 12px)' : '100%';
            const isStreaming = state === 'streaming';
            const testId = `millicastVideo${type.replace(/(?<=\w)(\w+)/, (match) => match.toLowerCase())}`;

            return (
              <WrapItem flexBasis={flexBasis} key={streamId} maxHeight={maxHeight} maxWidth={maxWidth} test-id={testId}>
                <PublisherVideoView
                  isActive={isStreaming}
                  settingsProps={settings(streamId)}
                  statistics={statistics}
                  videoProps={{
                    displayFullscreenButton: false,
                    displayVideo: mediaStream.getVideoTracks()[0].enabled,
                    label,
                    mediaStream: mediaStream,
                    mirrored: type === StreamTypes.MEDIA,
                    placeholderNode: (
                      <Box color="dolbyNeutral.700" height="174px" position="absolute" width="174px">
                        <IconProfile />
                      </Box>
                    ),
                    showDotIndicator: isStreaming,
                  }}
                />
              </WrapItem>
            );
          })}
        </Wrap>
      </Flex>
      <HStack alignItems="center" bottom="32px" h="48px" pos="fixed" w="96%">
        <Spacer />
        <Flex alignItems="center" direction="row" gap={2} justifyContent="flex-end">
          <PopupMenu
            buttonTitle="Add Source"
            disabled={streams.size >= MAX_SOURCES}
            items={[
              {
                icon: <IconPresent />,
                onClick: handleStartDisplayCapture,
                text: 'Share screen',
              },
              {
                icon: <IconAddCamera />,
                isDisabled: cameraList.length === 0 || microphoneList.length === 0,
                onClick: handleOpenDeviceSelection,
                text: 'Add cameras',
              },
              {
                icon: <IconStreamLocal />,
                onClick: onFileSelectModalOpen,
                text: 'Stream local file',
              },
            ]}
          />
          <DeviceSelection
            camera={newCamera}
            cameraList={cameraList}
            isOpen={isDeviceSelectionOpen}
            microphone={newMicrophone}
            microphoneList={microphoneList}
            onClose={handleCloseDeviceSelection}
            onSelectCamera={setNewCamera}
            onSelectMicrophone={setNewMicrophone}
            onSubmit={addNewDevice}
          />
        </Flex>
      </HStack>
      <Box>
        <Modal isCentered isOpen={isFileSelectModalOpen} onClose={onFileSelectModalClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalBody>
              <VStack>
                <Heading as="h4" size="md">
                  Add local media file
                </Heading>
                <Text fontSize="md">Pick a local file</Text>
                <Center
                  pb="32px"
                  pt="16px"
                  sx={{
                    '#pickFile': { color: 'white' },
                  }}
                  width="100%"
                >
                  <input id="pickFile" {...register()} />
                </Center>
                <Button onClick={addFileSource}>ADD STREAMING FILE</Button>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
      <Box bottom="5px" left="5px" position="fixed" test-id="appVersion">
        <Text fontSize="12px">Version: {__APP_VERSION__} </Text>
      </Box>
    </VStack>
  );
};

export default App;
