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
} from '@chakra-ui/react';
import { StreamStats, VideoCodec } from '@millicast/sdk';
import React, { useEffect, useMemo, useState } from 'react';

import ActionBar from '@millicast-react/action-bar';
import DeviceSelection from '@millicast-react/device-selection';
import { IconAddCamera, IconPresent, IconProfile } from '@millicast-react/dolbyio-icons';
import InfoLabel from '@millicast-react/info-label';
import LiveIndicator from '@millicast-react/live-indicator';
import ParticipantCount from '@millicast-react/participant-count';
import PopupMenu from '@millicast-react/popup-menu';
import ShareLinkButton from '@millicast-react/share-link-button';
import Timer from '@millicast-react/timer';
import useMultiMediaDevices, { Resolution, StreamId, StreamTypes } from '@millicast-react/use-multi-media-devices';
import useNotification from '@millicast-react/use-notification';
import usePublisher, { SourceState } from '@millicast-react/use-publisher';

import PublisherVideoView from './components/publisher-video-view';
import './styles/font.css';

const MAX_SOURCES = 4;

type PublisherState = SourceState;

const date = new Date();

function App() {
  const {
    isOpen: isDeviceSelectionOpen,
    onOpen: handleOpenDeviceSelection,
    onClose: handleCloseDeviceSelection,
  } = useDisclosure();

  const [bitrates, setBitrates] = useState<Map<StreamId, number>>(new Map());
  const [codecs, setCodecs] = useState<Map<StreamId, VideoCodec>>(new Map());
  const [isSimulcastEnabled, setIsSimulcastEnabled] = useState(true);
  const [labels, setLabels] = useState<Map<StreamId, string>>(new Map());
  const [newCamera, setNewCamera] = useState<InputDeviceInfo | undefined>(undefined);
  const [newMicrophone, setNewMicrophone] = useState<InputDeviceInfo | undefined>(undefined);
  const [publisherStates, setPublisherStates] = useState<Map<StreamId, PublisherState>>(new Map());
  const [statistics, setStatistics] = useState<Map<StreamId, StreamStats>>(new Map());

  const { showError } = useNotification();

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

  const {
    addStream,
    applyConstraints,
    cameraList,
    initDefaultStream,
    microphoneList,
    // TODO: remove and reset streams
    // removeStream,
    // reset,
    streams,
    // TODO: per-stream audio/video toggling
    // toggleAudio,
    // toggleVideo,
  } = useMultiMediaDevices();

  const {
    bitrateList,
    codecList,
    shareUrl,
    sources,
    startStreamingSource,
    stopStreamingSource,
    updateSourceBitrate,
    updateSourceMediaStream,
    viewerCount,
  } = usePublisher({
    handleError: showError,
    streamId: import.meta.env.VITE_MILLICAST_STREAM_ID,
    streamName: import.meta.env.VITE_MILLICAST_STREAM_NAME || date.valueOf().toString(),
    token: import.meta.env.VITE_MILLICAST_STREAM_PUBLISHING_TOKEN,
    viewerAppBaseUrl: import.meta.env.VITE_MILLICAST_VIEWER_BASE_URL,
  });

  const codecListSimulcast = useMemo(() => {
    if (isSimulcastEnabled) {
      return codecList.filter((item) => item !== 'vp9');
    }
    return codecList;
  }, [codecList, isSimulcastEnabled]);

  const hasStartedStreaming =
    !!publisherStates.size && Array.from(publisherStates).some(([, sourceState]) => sourceState === 'streaming');

  const isConnecting = Array.from(publisherStates).some(([, sourceState]) => sourceState === 'connecting');

  // Initialise default media device if no streams
  useEffect(() => {
    if (!streams.size) {
      initDefaultStream();
    }
  }, [cameraList.length, microphoneList.length, streams.size]);

  // Initialise new streams
  useEffect(() => {
    streams.forEach((stream, streamId) => {
      const { mediaStream } = stream;
      let bitrate, codec, label;

      // Initialise bitrate if missing
      if (!bitrates.get(streamId)) {
        bitrate = bitrateList[0].value;
        handleSelectBitrate(streamId, bitrate as number);
      }

      // Initialise codec if missing
      if (!codecs.get(streamId)) {
        codec = codecList[0];
        handleSelectCodec(streamId, codec as VideoCodec);
      }

      // Initialise name if missing
      if (!labels.get(streamId)) {
        if (stream.type === StreamTypes.MEDIA) {
          label = stream.device?.camera.label ?? '';
        } else {
          label = stream.mediaStream.getVideoTracks()[0].label ?? 'Screen share';
        }
        handleChangeLabel(streamId, label as string);
      }

      // Initialise publisher state if not streaming
      if (!hasStartedStreaming) {
        setPublisherStates((prevPublisherStates) => new Map([...prevPublisherStates, [streamId, 'ready']]));
      }

      // Handle initialisations if streams are already live
      if (hasStartedStreaming && mediaStream && publisherStates.get(streamId) !== 'streaming') {
        startStreamingSource({
          bandwidth: bitrate,
          codec,
          events: ['viewercount'],
          mediaStream,
          simulcast: isSimulcastEnabled,
          sourceId: streamId,
        });
      }

      // Update or abort mediastream
      if (mediaStream && sources.get(streamId)) {
        updateSourceMediaStream(streamId, mediaStream);
      } else {
        stopStreamingSource(streamId);
      }
    });
  }, [streams.size]);

  useEffect(() => {
    // If there are no sources (nothing is being provided to Millicast publisher), reset publisher states back to "ready"
    if (!sources.size) {
      setPublisherStates((prevPublisherStates) => {
        const newPublisherStates = new Map();

        Array.from(prevPublisherStates.keys()).forEach((sourceId) => {
          newPublisherStates.set(sourceId, 'ready');
        });

        return newPublisherStates;
      });

      return;
    }

    // Update local stream state using source state, bandwidth (bitrate), and statistics
    sources.forEach((source, sourceId) => {
      setPublisherStates((prevPublisherStates) => new Map([...prevPublisherStates, [sourceId, source.state]]));

      if (source.broadcastOptions.bandwidth) {
        handleSelectBitrate(sourceId, source.broadcastOptions.bandwidth);
      }

      if (source.statistics) {
        setStatistics((prevStatistics) => new Map([...prevStatistics, [sourceId, source.statistics as StreamStats]]));
      }
    });
  }, [sources]);

  const addNewDevice = async () => {
    if (sources.size < MAX_SOURCES) {
      await addStream({ camera: newCamera, microphone: newMicrophone, type: StreamTypes.MEDIA });
      handleCloseDeviceSelection();
      setNewCamera(undefined);
      setNewMicrophone(undefined);
    }
  };

  const handleSelectBitrate = (streamId: StreamId, newBitrate: number) => {
    if (publisherStates.get(streamId) === 'streaming') {
      updateSourceBitrate(streamId, newBitrate);
    }

    setBitrates((prevBitrates) => new Map([...prevBitrates, [streamId, newBitrate]]));
  };

  const handleSelectCodec = (streamId: StreamId, newCodec: VideoCodec) => {
    setCodecs((prevCodecs) => new Map([...prevCodecs, [streamId, newCodec]]));
  };

  const handleSelectVideoResolution = async (id: StreamId, resolution: Resolution) => {
    await applyConstraints({ id, videoConstraints: { height: resolution.height, width: resolution.width } });
  };

  const handleChangeLabel = (streamId: StreamId, newLabel: string) => {
    setLabels((prevLabels) => new Map([...prevLabels, [streamId, newLabel]]));
  };

  const handleSelectNewCamera = (camera: InputDeviceInfo) => {
    setNewCamera(camera);
  };

  const handleSelectNewMicrophone = (microphone: InputDeviceInfo) => {
    setNewMicrophone(microphone);
  };

  // const toggleDisplayCapture = async () => {
  // displayStream ? stopDisplayCapture() : await startDisplayCapture();
  // };
  const handleStartDisplayCapture = async () => {
    if (sources.size < MAX_SOURCES) {
      await addStream({ type: StreamTypes.DISPLAY });
    }
  };
  // TODO: handleStopDisplayCapture

  const handleStartLive = () => {
    if (streams.size) {
      streams.forEach((stream, streamId) => {
        try {
          startStreamingSource({
            bandwidth: bitrates.get(streamId),
            codec: codecs.get(streamId),
            events: ['viewercount'],
            mediaStream: stream.mediaStream,
            simulcast: isSimulcastEnabled,
            sourceId: streamId,
          });
        } catch (err) {
          showError(`Failed to start streaming: ${err}`);
        }
      });
    }
  };

  const handleStopLive = () => {
    for (const sourceId of sources.keys()) {
      stopStreamingSource(sourceId);
    }
  };

  const settings = (streamId: StreamId) => {
    const bitrate = bitrates.get(streamId);
    const codec = codecs.get(streamId);
    const isStreaming = publisherStates.get(streamId) === 'streaming';
    const stream = streams.get(streamId);
    const { type } = stream;

    const { height, width } = stream?.settings?.camera ?? {};
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
        isDisabled: publisherStates.get(streamId) !== 'ready',
        isHidden: isStreaming || !codecList.length,
        options: codecListSimulcast,
        value: codec ?? codecList[0],
      },
      name: {
        handleChange: (data: unknown) => {
          handleChangeLabel(streamId, data as string);
        },
        isDisabled: isConnecting,
        isHidden: isStreaming,
        value: labels.get(streamId) ?? '',
      },
      resolution: {
        handleSelect: (data: unknown) => {
          handleSelectVideoResolution(streamId, data as Resolution);
        },
        isDisabled: type === StreamTypes.DISPLAY || isConnecting,
        isHidden: type === StreamTypes.DISPLAY,
        options: stream?.resolutions ?? [],
        value: resolution,
      },
      simulcast: {
        handleToggle: () => {
          setIsSimulcastEnabled((prevIsSimulcastEnabled) => !prevIsSimulcastEnabled);
        },
        isDisabled: isConnecting,
        isHidden: isStreaming || codec === 'vp9',
        value: isSimulcastEnabled,
      },
    };
  };

  return (
    <VStack minH="100vh" w="100vw" bg="background" p="6">
      <Box w="100%" h="146px">
        <ActionBar title="Company name" />
        <Flex w="100%" justifyContent="space-between" mt="4" position="relative" zIndex={1}>
          <Stack direction="column" spacing="4" alignItems="flex-start">
            <Flex alignItems="center">
              <Timer isActive={hasStartedStreaming} />
              {sources.size > 1 && (
                <InfoLabel
                  test-id="multiSource"
                  text="Multisource enabled"
                  ml="2.5"
                  color="white"
                  bgColor="dolbyNeutral.300"
                  py="5px"
                  h="auto"
                  fontWeight="600"
                />
              )}
            </Flex>
            <LiveIndicator
              disabled={!streams.size}
              isActive={hasStartedStreaming}
              isLoading={isConnecting}
              start={handleStartLive}
              stop={handleStopLive}
            />
          </Stack>
          <Stack direction="column" spacing="4" alignItems="flex-end">
            {shareUrl && <ShareLinkButton tooltip={{ placement: 'top' }} linkText={shareUrl} />}
            {hasStartedStreaming && <ParticipantCount count={viewerCount} />}
          </Stack>
        </Flex>
      </Box>
      <Flex alignItems="center" position="relative" pt="20px" width="100%">
        {!hasStartedStreaming && (
          <VStack position="absolute" top="0" left="50%" transform="translate(-50%, -110%)">
            <Heading test-id="pageHeader" as="h2" fontSize="24px" fontWeight="600">
              Get started
            </Heading>
            <Text test-id="pageDesc">Setup your audio and video before going live.</Text>
          </VStack>
        )}
        <Wrap justify="center" margin="0 auto" maxWidth="1388px" spacing="12px" width="100%">
          {Array.from(streams).map(([streamId, stream]) => {
            const [maxHeight, maxWidth] = (() => {
              switch (streams.size) {
                case 1:
                  return ['564px', '1035px'];
                case 2:
                  return ['382px', '688px'];
                default:
                  return ['282px', '508px'];
              }
            })();

            const flexBasis = streams.size > 1 ? 'calc(50% - 12px)' : '100%';
            const isStreaming = publisherStates.get(streamId) === 'streaming';

            return (
              <WrapItem
                flexBasis={flexBasis}
                key={streamId}
                maxHeight={maxHeight}
                maxWidth={maxWidth}
                test-id={'millicastVideo' + stream.type}
              >
                <PublisherVideoView
                  isActive={isStreaming}
                  settingsProps={settings(streamId)}
                  statistics={statistics.get(streamId)}
                  videoProps={{
                    displayFullscreenButton: false,
                    displayVideo: stream.mediaStream.getVideoTracks()[0].enabled,
                    label: labels.get(streamId),
                    mediaStream: stream.mediaStream,
                    mirrored: stream.type === StreamTypes.MEDIA,
                    placeholderNode: (
                      <Box color="dolbyNeutral.700" position="absolute" width="174px" height="174px">
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
      <HStack alignItems="center" w="96%" h="48px" pos="fixed" bottom="32px">
        <Spacer />
        <Flex direction="row" gap={2} justifyContent="flex-end" alignItems="center">
          <PopupMenu
            buttonTitle="Add Source"
            items={[
              {
                icon: <IconPresent />,
                text: 'Share screen',
                onClick: handleStartDisplayCapture,
              },
              {
                icon: <IconAddCamera />,
                text: 'Add cameras',
                onClick: handleOpenDeviceSelection,
              },
              // {
              //   icon: <IconStream />,
              //   text: 'Stream local file',
              //   onClick: () => console.log('stream'),
              //   isDisabled: true,
              // },
            ]}
            disabled={streams.size >= MAX_SOURCES}
          />
          <DeviceSelection
            camera={newCamera}
            cameraList={cameraList}
            isOpen={isDeviceSelectionOpen}
            microphone={newMicrophone}
            microphoneList={microphoneList}
            onClose={handleCloseDeviceSelection}
            onSelectCamera={handleSelectNewCamera}
            onSelectMicrophone={handleSelectNewMicrophone}
            onSubmit={addNewDevice}
          />
        </Flex>
      </HStack>
      <Box test-id="appVersion" position="fixed" bottom="5px" left="5px">
        <Text fontSize="12px">Version: {__APP_VERSION__} </Text>
      </Box>
    </VStack>
  );
}

export default App;
