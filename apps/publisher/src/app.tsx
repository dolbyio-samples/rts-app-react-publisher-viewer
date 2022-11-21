import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Spacer,
  Stack,
  HStack,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import './styles/font.css';
import usePublisher from '@millicast-react/use-publisher';
import useMediaDevices from '@millicast-react/use-media-devices';
import {
  IconMicrophoneOn,
  IconMicrophoneOff,
  IconCameraOn,
  IconCameraOff,
  IconSettings,
  IconPresent,
  IconProfile,
  IconCodec,
  IconResolution,
  IconSimulcast,
  IconInfo,
  IconClose,
} from '@millicast-react/dolbyio-icons';
import VideoView from '@millicast-react/video-view';
import ParticipantCount from '@millicast-react/participant-count';
import ShareLinkButton from '@millicast-react/share-link-button';
import ToggleButton from '@millicast-react/toggle-button';
import PopupMenu from '@millicast-react/popup-menu';
import LiveIndicator from '@millicast-react/live-indicator';
import Timer from '@millicast-react/timer';
import IconButton from '@millicast-react/icon-button';
import ActionBar from '@millicast-react/action-bar';
import ControlBar from '@millicast-react/control-bar';
import Dropdown from '@millicast-react/dropdown';
import useCameraCapabilities, { Resolution } from './hooks/use-camera-capabilities';
import StatisticsInfo from '@millicast-react/statistics-info';
import InfoLabel from '@millicast-react/info-label';

const displayShareSourceId = 'DisplayShare';

function App() {
  const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onClose: onDrawerClose } = useDisclosure();

  const {
    setupPublisher,
    startStreaming,
    stopStreaming,
    updateStreaming,
    startDisplayStreaming,
    stopDisplayStreaming,
    codec,
    codecList,
    updateCodec,
    publisherState,
    viewerCount,
    linkText,
    statistics,
  } = usePublisher();

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
  } = useMediaDevices();

  const [isSimulcastEnabled, setIsSimulcastEnabled] = useState(true);
  const resolutionList = useCameraCapabilities(cameraCapabilities);

  useEffect(() => {
    setupPublisher(
      import.meta.env.VITE_MILLICAST_STREAM_PUBLISHING_TOKEN,
      import.meta.env.VITE_MILLICAST_STREAM_NAME,
      import.meta.env.VITE_MILLICAST_STREAM_ID
    );
  }, []);

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

  useEffect(() => {
    if (mediaStream) {
      updateStreaming(mediaStream);
    }
  }, [mediaStream]);

  useEffect(() => {
    if (!displayStream) stopDisplayStreaming();
    else if (publisherState === 'streaming')
      startDisplayStreaming({
        mediaStream: displayStream,
        sourceId: displayShareSourceId,
      });
  }, [displayStream, publisherState]);

  const codecListSimulcast = useMemo(() => {
    if (isSimulcastEnabled) {
      return codecList.filter((item) => item !== 'vp9');
    }
    return codecList;
  }, [codecList, isSimulcastEnabled]);

  const onSelectVideoResolution = useCallback(
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

  const toggleShare = async () => {
    displayStream ? stopDisplayCapture() : await startDisplayCapture();
  };

  const isStreaming = publisherState === 'streaming';

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

  return (
    <Flex direction="column" minH="100vh" w="100vw" bg="background" p="6">
      <Box w="100%" h="146px">
        <ActionBar title="Company name" />
        <Flex w="100%" justifyContent="space-between" mt="4" position="relative" zIndex={1}>
          <Stack direction="column" spacing="4" alignItems="flex-start">
            <Flex alignItems="center">
              <Timer isActive={isStreaming} />
              {displayStream && (
                <InfoLabel
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
              isLoading={publisherState === 'connecting'}
              start={() => {
                if (publisherState == 'ready' && mediaStream) {
                  if (displayStream) {
                    startDisplayStreaming({
                      mediaStream: displayStream,
                      sourceId: displayShareSourceId,
                    });
                  }
                  startStreaming({
                    mediaStream,
                    simulcast: isSimulcastEnabled,
                    codec,
                    events: ['viewercount'],
                  });
                }
              }}
              stop={() => {
                stopDisplayStreaming();
                stopStreaming();
              }}
            />
          </Stack>
          <Stack direction="column" spacing="4" alignItems="flex-end">
            <ShareLinkButton tooltip={{ placement: 'top' }} linkText={linkText} />
            {isStreaming && <ParticipantCount count={viewerCount} />}
          </Stack>
        </Flex>
      </Box>
      <Flex width="100%" alignItems="center" position="relative" pt="20px">
        {!isStreaming && (
          <VStack position="absolute" top="0" left="50%" transform="translate(-50%, -110%)">
            <Heading test-id="getStartedInfoTitle" as="h2" fontSize="24px" fontWeight="600">
              Get started
            </Heading>
            <Text>Setup your audio and video before going live.</Text>
          </VStack>
        )}
        <Stack direction="row" justifyContent="center" alignItems="center" w="100%" spacing="6">
          {mediaStream && (
            <Stack direction="column" justifyContent="center" alignItems="center" spacing={4}>
              (
              <VideoView
                width={displayStream ? '688px' : '836px'}
                height={displayStream ? '382px' : '464px'}
                mirrored={true}
                mediaStream={mediaStream}
                displayFullscreenButton={false}
                displayVideo={isVideoEnabled}
                label={camera?.label}
                placeholderNode={
                  <Box color="dolbyNeutral.700" position="absolute" width="174px">
                    <IconProfile />
                  </Box>
                }
                showDotIndicator={isStreaming}
              />
              <MediaControlBar />)
            </Stack>
          )}
          {displayStream && (
            <Stack direction="column" spacing={4}>
              <VideoView
                width="688px"
                height="382px"
                mediaStream={displayStream}
                displayFullscreenButton={false}
                label={displayStream.getVideoTracks()[0].label}
                showDotIndicator={isStreaming}
              />
              <ControlBar
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
              items={[
                { icon: <IconPresent />, text: displayStream ? 'Stop share' : 'Share screen', onClick: toggleShare },
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
          <IconButton
            test-id="settingsButton"
            tooltip={{ label: 'Settings' }}
            onClick={onDrawerOpen}
            isDisabled={!(mediaStream && mediaStream.getVideoTracks().length)}
            icon={<IconSettings />}
            borderRadius="50%"
            reversed
          />
        </Flex>
        {/* Drawer */}
        <Drawer isOpen={isDrawerOpen} placement="right" onClose={onDrawerClose}>
          <DrawerOverlay />
          <DrawerContent bg="dolbyNeutral.800" color="white">
            <DrawerHeader textAlign="center">Settings</DrawerHeader>
            <DrawerCloseButton />
            <DrawerBody>
              <Stack direction="column" spacing={4}>
                <Box>
                  {cameraList.length && cameraSettings && camera && (
                    <Dropdown
                      leftIcon={<IconCameraOn />}
                      disabled={publisherState === 'connecting'}
                      testId="camera-select"
                      elementsList={cameraList}
                      elementResolver={(element) => {
                        const device = element as InputDeviceInfo;
                        return {
                          id: device.deviceId,
                          label: device.label,
                          data: device,
                        };
                      }}
                      onSelect={(data) => {
                        setCamera(data as InputDeviceInfo);
                      }}
                      selected={camera.label}
                      placeholder="Camera"
                    />
                  )}
                </Box>
                <Box>
                  {microphoneList.length && microphoneSettings && microphone && (
                    <Dropdown
                      leftIcon={<IconMicrophoneOn />}
                      disabled={publisherState === 'connecting'}
                      testId="microphone-select"
                      elementsList={microphoneList}
                      elementResolver={(element) => {
                        const device = element as InputDeviceInfo;
                        return {
                          id: device.deviceId,
                          label: device.label,
                          data: device,
                        };
                      }}
                      onSelect={(data) => {
                        setMicrophone(data as InputDeviceInfo);
                      }}
                      selected={microphone.label}
                      placeholder="Microphone"
                    />
                  )}
                </Box>
                {!isStreaming && codecList.length !== 0 && (
                  <Box>
                    <Dropdown
                      leftIcon={<IconCodec />}
                      disabled={publisherState !== 'ready' || codecList.length === 0}
                      testId="codecSelect"
                      elementsList={codecListSimulcast}
                      elementResolver={(element) => ({
                        id: element as string,
                        label: element as string,
                        data: element as string,
                      })}
                      onSelect={(data) => updateCodec(data as string)}
                      selected={codec || (codecList.length !== 0 ? codecList[0] : undefined)}
                      placeholder="Codec"
                    />
                  </Box>
                )}
                {mediaStream && resolutionList.length && cameraSettings && (
                  <Box>
                    <Dropdown
                      leftIcon={<IconResolution />}
                      testId="resolutionSelect"
                      elementsList={resolutionList}
                      elementResolver={(element) => {
                        const resolution = element as Resolution;
                        return {
                          id: `${resolution.width}x${resolution.height}`,
                          label: `${resolution.width}x${resolution.height}`,
                          data: resolution,
                        };
                      }}
                      onSelect={(data) => onSelectVideoResolution(data as Resolution)}
                      selected={`${cameraSettings.width}x${cameraSettings.height}`}
                      placeholder="Resolution"
                    />
                  </Box>
                )}
                {!isStreaming && (
                  <ToggleButton
                    test-id="simulcastSwitch"
                    onClick={() => setIsSimulcastEnabled(!isSimulcastEnabled)}
                    isActive={isSimulcastEnabled}
                    label="Simulcast"
                    leftIcon={<IconSimulcast />}
                    isDisabled={codec === 'vp9'}
                  />
                )}
              </Stack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </HStack>
      <Box test-id="appVersion" position="fixed" bottom="5px" left="5px">
        <Text fontSize="12px">Version: {__APP_VERSION__} </Text>
      </Box>
    </Flex>
  );
}

export default App;
