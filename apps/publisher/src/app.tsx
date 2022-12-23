import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Flex,
  HStack,
  Heading,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Spacer,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import {
  IconCameraOff,
  IconCameraOn,
  IconClose,
  IconInfo,
  IconMicrophoneOff,
  IconMicrophoneOn,
  IconPresent,
  IconProfile,
} from '@millicast-react/dolbyio-icons';
import './styles/font.css';
import usePublisher from '@millicast-react/use-publisher';
import type { SourceState } from '@millicast-react/use-publisher';
import useMediaDevices from '@millicast-react/use-media-devices';
import VideoView from '@millicast-react/video-view';
import ParticipantCount from '@millicast-react/participant-count';
import ShareLinkButton from '@millicast-react/share-link-button';
import PopupMenu from '@millicast-react/popup-menu';
import LiveIndicator from '@millicast-react/live-indicator';
import Timer from '@millicast-react/timer';
import IconButton from '@millicast-react/icon-button';
import ActionBar from '@millicast-react/action-bar';
import ControlBar from '@millicast-react/control-bar';
import StatisticsInfo from '@millicast-react/statistics-info';
import InfoLabel from '@millicast-react/info-label';
import useNotification from '@millicast-react/use-notification';
import type { StreamStats, VideoCodec } from '@millicast/sdk';
import useCameraCapabilities, { Resolution } from './hooks/use-camera-capabilities';

//TODO: Support more than 2 sources
const MainSourceId = 'Main';
const DisplayShareSourceId = 'DisplayShare';
type PublisherState = SourceState;

const date = new Date();

function App() {
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

  const {
    startStreamingSource,
    stopStreamingSource,
    updateSourceMediaStream,
    updateSourceBitrate,
    sources,
    codecList,
    bitrateList,
    viewerCount,
    shareUrl,
  } = usePublisher({
    token: import.meta.env.VITE_MILLICAST_STREAM_PUBLISHING_TOKEN,
    streamId: import.meta.env.VITE_MILLICAST_STREAM_ID,
    streamName: import.meta.env.VITE_MILLICAST_STREAM_NAME || date.valueOf().toString(),
    viewerAppBaseUrl: import.meta.env.VITE_MILLICAST_VIEWER_BASE_URL,
    handleError: showError,
  });

  const {
    cameraList,
    microphoneList,
    camera,
    setCamera,
    microphone,
    setMicrophone,
    isAudioEnabled,
    isVideoEnabled,
    toggleAudio,
    toggleVideo,
    mediaStream,
    applyMediaTrackConstraints,
    startDisplayCapture,
    stopDisplayCapture,
    displayStream,
    cameraCapabilities,
    cameraSettings,
    microphoneSettings,
  } = useMediaDevices({ handleError: showError });

  const [publisherState, setPublisherState] = useState<PublisherState>('ready');
  const [isSimulcastEnabled, setIsSimulcastEnabled] = useState(true);
  const [codec, setCodec] = useState<VideoCodec>();
  const [bitrate, setBitrate] = useState<number>(0);
  const [statistics, setStatistics] = useState<StreamStats>();
  const resolutionList = useCameraCapabilities(cameraCapabilities);

  useEffect(() => {
    if (sources.size === 0) {
      setPublisherState('ready');
      return;
    }
    for (const [id, source] of sources) {
      if (id === MainSourceId) {
        setPublisherState(source.state);
        if (source.broadcastOptions.bandwidth) setBitrate(source.broadcastOptions.bandwidth);
        if (source.statistics) setStatistics(source.statistics);
        break;
      }
    }
  }, [sources]);

  useEffect(() => {
    if (mediaStream) {
      updateSourceMediaStream(MainSourceId, mediaStream);
    }
  }, [mediaStream]);

  const displayStreamLabel = useMemo(() => {
    if (displayStream) {
      if (displayStream.getVideoTracks()[0].label.length > 0) {
        return displayStream.getVideoTracks()[0].label.split(':')[0];
      } else {
        return 'Screen Share';
      }
    }
    return '';
  }, [displayStream]);

  useEffect(() => {
    if (!displayStream) stopStreamingSource(DisplayShareSourceId);
    else if (publisherState === 'streaming')
      startStreamingSource({
        mediaStream: displayStream,
        sourceId: DisplayShareSourceId,
        simulcast: isSimulcastEnabled,
        codec,
        events: ['viewercount'],
        bandwidth: bitrate,
      });
  }, [displayStream, publisherState]);

  useEffect(() => {
    if (!codec && codecList.length) setCodec(codecList[0]);
  }, [codecList]);

  const codecListSimulcast = useMemo(() => {
    if (isSimulcastEnabled) {
      return codecList.filter((item) => item !== 'vp9');
    }
    return codecList;
  }, [codecList, isSimulcastEnabled]);

  const handleSelectBitrate = (bitrate: number) => {
    if (isStreaming) updateSourceBitrate(MainSourceId, bitrate);
    else setBitrate(bitrate);
  };

  const handleSelectResolution = useCallback(
    async (resolution: Resolution) => {
      const videoConstraints = cameraSettings as MediaTrackConstraintSet;
      if (videoConstraints && cameraSettings) {
        videoConstraints.deviceId = { exact: cameraSettings?.deviceId };
        videoConstraints.width = { exact: resolution.width };
        videoConstraints.height = { exact: resolution.height };
        delete videoConstraints.frameRate;
        delete videoConstraints.aspectRatio;
      } else {
        return;
      }
      const audioConstraints = mediaStream?.getAudioTracks()[0].getSettings() ?? {};
      try {
        await applyMediaTrackConstraints(audioConstraints, videoConstraints);
      } catch (error) {
        videoConstraints.width = { ideal: resolution.width };
        videoConstraints.height = { ideal: resolution.height };
        await applyMediaTrackConstraints(audioConstraints, videoConstraints);
      }
    },
    [resolutionList]
  );

  const isStreaming = publisherState === 'streaming';
  const isConnecting = publisherState === 'connecting';

  // TODO: handle settings on a per-stream basis
  const settings = {
    bitrate: {
      handleSelect: (data: unknown) => {
        handleSelectBitrate(data as number);
      },
      isDisabled: isConnecting,
      isHidden: !bitrateList.length,
      options: bitrateList,
      value: bitrateList.find((b) => b.value === bitrate)?.name || bitrateList[0].name,
    },
    codec: {
      handleSelect: (data: unknown) => {
        setCodec(data as VideoCodec);
      },
      isDisabled: publisherState !== 'ready',
      isHidden: isStreaming || !codecList.length,
      options: codecListSimulcast,
      value: codec || codecList[0],
    },
    fullHeight: true,
    name: {
      // TODO: update name
      handleChange: () => null,
      isDisabled: isConnecting,
      isHidden: isStreaming,
      // TODO: current name
      value: '',
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

  const MediaControlBar = () => (
    <ControlBar
      controls={[
        {
          key: 'toggleMicrophoneButton',
          'test-id': 'toggleMicrophoneButton',
          tooltip: { label: 'Toggle microphone', placement: 'top' },
          onClick: () => {
            toggleAudio();
          },
          isActive: !isAudioEnabled,
          isDisabled: !(mediaStream && mediaStream.getAudioTracks().length),
          icon: isAudioEnabled ? <IconMicrophoneOn /> : <IconMicrophoneOff />,
        },
        {
          key: 'toggleCameraButton',
          'test-id': 'toggleCameraButton',
          tooltip: { label: 'Toggle camera', placement: 'top' },
          onClick: () => {
            toggleVideo();
          },
          isActive: !isVideoEnabled,
          isDisabled: !(mediaStream && mediaStream.getVideoTracks().length),
          icon: isVideoEnabled ? <IconCameraOn /> : <IconCameraOff />,
        },
      ]}
    />
  );

  const toggleDisplayCapture = async () => {
    displayStream ? stopDisplayCapture() : await startDisplayCapture();
  };
  return (
    <VStack minH="100vh" w="100vw" bg="background" p="6">
      <Box w="100%" h="146px">
        <ActionBar title="Company name" />
        <Flex w="100%" justifyContent="space-between" mt="4" position="relative" zIndex={1}>
          <Stack direction="column" spacing="4" alignItems="flex-start">
            <Flex alignItems="center">
              <Timer isActive={isStreaming} />
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
              isActive={isStreaming}
              isLoading={isConnecting}
              disabled={!mediaStream && !displayStream}
              start={() => {
                if (mediaStream) {
                  try {
                    startStreamingSource({
                      mediaStream,
                      sourceId: MainSourceId,
                      simulcast: isSimulcastEnabled,
                      codec,
                      events: ['viewercount'],
                      bandwidth: bitrate,
                    });
                    if (displayStream) {
                      startStreamingSource({
                        mediaStream: displayStream,
                        sourceId: DisplayShareSourceId,
                        simulcast: isSimulcastEnabled,
                        codec,
                        events: ['viewercount'],
                        bandwidth: bitrate,
                      });
                    }
                  } catch (err) {
                    showError(`Failed to start streaming: ${err}`);
                    setBitrate(0);
                  }
                }
              }}
              stop={() => {
                for (const sourceId of sources.keys()) {
                  stopStreamingSource(sourceId);
                }
              }}
            />
          </Stack>
          <Stack direction="column" spacing="4" alignItems="flex-end">
            {shareUrl && <ShareLinkButton tooltip={{ placement: 'top' }} linkText={shareUrl} />}
            {isStreaming && <ParticipantCount count={viewerCount} />}
          </Stack>
        </Flex>
      </Box>
      <Flex width="100%" alignItems="center" position="relative" pt="20px">
        {!isStreaming && (
          <VStack position="absolute" top="0" left="50%" transform="translate(-50%, -110%)">
            <Heading test-id="pageHeader" as="h2" fontSize="24px" fontWeight="600">
              Get started
            </Heading>
            <Text test-id="pageDesc">Setup your audio and video before going live.</Text>
          </VStack>
        )}
        <Stack direction="row" justifyContent="center" alignItems="center" w="100%" spacing="6">
          {mediaStream && (
            <Stack direction="column" justifyContent="center" alignItems="center" spacing={4}>
              (
              <VideoView
                displayFullscreenButton={false}
                displayVideo={isVideoEnabled}
                height={displayStream ? '382px' : '464px'}
                label={camera?.label}
                mediaStream={mediaStream}
                mirrored={true}
                placeholderNode={
                  <Box color="dolbyNeutral.700" position="absolute" width="174px" height="174px">
                    <IconProfile />
                  </Box>
                }
                settings={settings}
                showDotIndicator={isStreaming}
                width={displayStream ? '688px' : '836px'}
              />
              <MediaControlBar />)
            </Stack>
          )}
          {displayStream && (
            <Stack direction="column" spacing={4}>
              <VideoView
                displayFullscreenButton={false}
                height="382px"
                label={displayStreamLabel}
                mediaStream={displayStream}
                settings={settings}
                showDotIndicator={isStreaming}
                width="688px"
              />
              <ControlBar
                controls={[
                  {
                    key: 'stopScreenShare',
                    'test-id': 'stopScreenShare',
                    tooltip: { label: 'Stop screen share', placement: 'top' },
                    onClick: () => {
                      stopDisplayCapture();
                    },
                    icon: <IconClose width="16px" height="16px" />,
                    reversed: true,
                  },
                ]}
              />
            </Stack>
          )}
        </Stack>
      </Flex>
      <HStack alignItems="center" w="96%" h="48px" pos="fixed" bottom="32px">
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
          {!displayStream && (
            <PopupMenu
              buttonTitle="Add Source"
              items={[
                {
                  icon: <IconPresent />,
                  text: displayStream ? 'Stop share' : 'Share screen',
                  onClick: toggleDisplayCapture,
                },
                // {
                //   icon: <IconAddCamera />,
                //   text: 'Add cameras',
                //   onClick: () => console.log('cameras'),
                //   isDisabled: true,
                // },
                // {
                //   icon: <IconStream />,
                //   text: 'Stream local file',
                //   onClick: () => console.log('stream'),
                //   isDisabled: true,
                // },
              ]}
            />
          )}
        </Flex>
      </HStack>
      <Box test-id="appVersion" position="fixed" bottom="5px" left="5px">
        <Text fontSize="12px">Version: {__APP_VERSION__} </Text>
      </Box>
    </VStack>
  );
}

export default App;
