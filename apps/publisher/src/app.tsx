import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Spacer,
  Stack,
  Text,
  VStack,
  Wrap,
  WrapItem,
  useDisclosure,
} from '@chakra-ui/react';
import { VideoCodec } from '@millicast/sdk';
import React, { FormEvent, useEffect, useMemo, useState } from 'react';

import ActionBar from '@millicast-react/action-bar';
import DeviceSelection from '@millicast-react/device-selection';
import { IconAddCamera, IconPresent, IconProfile, IconStreamLocal } from '@millicast-react/dolbyio-icons';
import InfoLabel from '@millicast-react/info-label';
import LiveIndicator from '@millicast-react/live-indicator';
import ParticipantCount from '@millicast-react/participant-count';
import PopupMenu from '@millicast-react/popup-menu';
import ShareLinkButton from '@millicast-react/share-link-button';
import Timer from '@millicast-react/timer';
import useMultiMediaStreams, { Resolution, StreamTypes } from '@millicast-react/use-multi-media-streams';
import useNotification from '@millicast-react/use-notification';
import usePublisher, { bitrateList } from '@millicast-react/use-publisher';

import PublisherVideoView from './components/publisher-video-view';

import './styles/font.css';

const MAX_SOURCES = 4;
const TIMESTAMP_STREAM_NAME = new Date().valueOf().toString();

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

  const [allLive, setAllLive] = useState(false);
  const [newCamera, setNewCamera] = useState<InputDeviceInfo>();
  const [newMicrophone, setNewMicrophone] = useState<InputDeviceInfo>();

  const { showError } = useNotification();

  const { addStream, applyConstraints, cameraList, initDefaultStream, microphoneList, removeStream, streams } =
    useMultiMediaStreams();

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
    streamName: VITE_MILLICAST_STREAM_NAME || TIMESTAMP_STREAM_NAME,
    streamNameId: VITE_MILLICAST_STREAM_ID,
    streams,
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

  useEffect(() => {
    if (!allLive) {
      return;
    }

    sources.forEach((source, id) => {
      try {
        if (!source.publish.isActive()) {
          startStreamingToSource(id);
        }
      } catch (error) {
        showError(`Failed to start streaming: ${error}`);
      }
    });
  }, [sources.size]);

  const addNewDevice = async () => {
    if (!newCamera || !newMicrophone) {
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

  const handleChangeLabel = (id: string, newLabel: string) => {
    const stream = streams.get(id);

    if (!stream) {
      return;
    }

    const allLabels = Array.from(sources).map(([, { broadcastOptions }]) => broadcastOptions.sourceId);

    let dedupedLabel = newLabel;

    if (allLabels.includes(newLabel)) {
      dedupedLabel = newLabel.replace(/\((?<dupeCounter>\d+)\)$|$/, (match, dupeCounter) => {
        if (!match) {
          return ' (2)';
        }

        return `(${parseInt(dupeCounter, 10) + 1})`;
      });
    }

    updateSourceBroadcastOptions(id, { sourceId: dedupedLabel });
  };

  const handleRemove = (id: string) => {
    stopStreamingToSource(id);
    removeStream(id);
  };

  const handleSelectBitrate = (id: string, bitrate: number) => {
    const source = sources.get(id);

    if (!source) {
      return;
    }

    updateSourceBroadcastOptions(id, { bandwidth: bitrate });
  };

  const handleSelectCodec = (id: string, codec: VideoCodec) => {
    const source = sources.get(id);

    if (!source) {
      return;
    }

    updateSourceBroadcastOptions(id, { codec });
  };

  const handleSelectVideoResolution = async (id: string, resolution: Resolution) => {
    await applyConstraints(id, { videoConstraints: { height: resolution.height, width: resolution.width } });
  };

  const handleSetSimulcast = (id: string, simulcast: boolean) => {
    const source = sources.get(id);

    if (!source) {
      return;
    }

    updateSourceBroadcastOptions(id, { simulcast });
  };

  const handleSrcMediaStreamReady = (id: string) => (mediaStream: MediaStream) => {
    updateSourceMediaStream(id, mediaStream);
  };

  const handleStartDisplayCapture = async () => {
    if (sources.size < MAX_SOURCES) {
      await addStream({ type: StreamTypes.DISPLAY });
    }
  };

  const handleStartAllLive = () => {
    for (const id of sources.keys()) {
      try {
        startStreamingToSource(id);
      } catch (error) {
        showError(`Failed to start streaming: ${error}`);
      }
    }

    setAllLive(true);
  };

  // TODO: const handleStopDisplayCapture = () => {}

  const handleStopAllLive = () => {
    for (const id of sources.keys()) {
      stopStreamingToSource(id);
    }

    setAllLive(false);
  };

  const handleStopLive = (id: string) => {
    stopStreamingToSource(id);

    setAllLive(false);
  };

  const handleSubmitLocalFile = (event: FormEvent) => {
    event.preventDefault();

    const data = new FormData(event.target as HTMLFormElement);

    const { file } = Object.fromEntries(data.entries());

    if (file && file instanceof File) {
      const objectUrl = URL.createObjectURL(file);

      addStream({ label: file.name, objectUrl, type: StreamTypes.LOCAL });
    }

    onFileSelectModalClose();
  };

  const settings = (id: string) => {
    const stream = streams.get(id);
    const source = sources.get(id);

    if (!stream || !source) {
      return {};
    }

    const { resolutions, type } = stream;
    const {
      broadcastOptions: { bandwidth: bitrate, codec, mediaStream, simulcast, sourceId: label },
      state,
    } = source;

    const codecListSimulcast = simulcast ? codecList.filter((item) => item !== 'vp9') : codecList;

    const isConnecting = state === 'connecting';
    const isReady = state === 'ready';
    const isStreaming = state === 'streaming';

    const { height, width } = mediaStream?.getVideoTracks()[0].getSettings() ?? {};
    const resolution = height && width ? `${width}x${height}` : '';

    return {
      bitrate: {
        handleSelect: (data: unknown) => {
          handleSelectBitrate(id, data as number);
        },
        isDisabled: isConnecting,
        isHidden: !bitrateList.length,
        options: bitrateList,
        value: bitrateList.find(({ value }) => value === bitrate)?.name ?? bitrateList[0].name,
      },
      codec: {
        handleSelect: (data: unknown) => {
          handleSelectCodec(id, data as VideoCodec);
        },
        isDisabled: !isReady,
        isHidden: isStreaming || !codecList.length,
        options: codecListSimulcast,
        value: codec ?? codecList[0],
      },
      name: {
        handleChange: (data: unknown) => {
          handleChangeLabel(id, data as string);
        },
        isDisabled: !isReady,
        isHidden: isStreaming,
        value: label,
      },
      resolution: {
        handleSelect: (data: unknown) => {
          handleSelectVideoResolution(id, data as Resolution);
        },
        isDisabled: type !== StreamTypes.MEDIA || isConnecting,
        isHidden: type !== StreamTypes.MEDIA,
        options: resolutions ?? [],
        value: resolution,
      },
      simulcast: {
        handleToggle: () => {
          handleSetSimulcast(id, !simulcast);
        },
        isDisabled: !isReady,
        isHidden: isStreaming || codec === 'vp9',
        value: !!simulcast,
      },
    };
  };

  const isMultiSourceStreaming = Array.from(sources).filter(([, { publish }]) => publish.isActive()).length > 1;
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
              {isMultiSourceStreaming && (
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
              start={handleStartAllLive}
              stop={handleStopAllLive}
              testId={isPublisherStreaming ? 'stop-all-live-indicator' : 'start-all-live-indicator'}
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
          {Array.from(sources).map(([id, source]) => {
            const {
              broadcastOptions: { sourceId: label, mediaStream },
              state,
              statistics,
            } = source;
            const { objectUrl, type } = streams.get(id) ?? {};

            const flexBasis = streams.size > 1 ? 'calc(50% - 12px)' : '100%';
            const testId = `millicastVideo${type?.replace(/(?<=\w)(\w+)/, (match) => match.toLowerCase())}`;

            // Kill if device is disconnected, screenshare has stopped, etc
            mediaStream?.getTracks().forEach((track) => {
              track.addEventListener('ended', () => {
                handleRemove(id);
              });
            });

            return (
              <WrapItem flexBasis={flexBasis} key={id} maxHeight={maxHeight} maxWidth={maxWidth} test-id={testId}>
                <PublisherVideoView
                  canTogglePlayback={type === StreamTypes.LOCAL}
                  isConnecting={state === 'connecting'}
                  isStreaming={state === 'streaming'}
                  onRemove={() => handleRemove(id)}
                  onStartLive={() => startStreamingToSource(id)}
                  onStopLive={() => handleStopLive(id)}
                  settings={settings(id)}
                  statistics={statistics}
                  videoProps={{
                    label,
                    mediaStream,
                    mirrored: type === StreamTypes.MEDIA,
                    onSrcMediaStreamReady: objectUrl ? handleSrcMediaStreamReady(id) : undefined,
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
                    showDotIndicator: state === 'streaming',
                    src: objectUrl,
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
                <form onSubmit={handleSubmitLocalFile}>
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
                    <input accept="video/*" id="pickFile" multiple={false} name="file" type="file" />
                  </Center>
                  <Button type="submit">ADD STREAMING FILE</Button>
                </form>
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
