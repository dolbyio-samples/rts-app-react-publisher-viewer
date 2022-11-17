import React, { useEffect, useState, useCallback } from 'react';
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
  PopoverArrow,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Stack,
  Text,
  useDisclosure,
  VStack,
  Spacer,
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
  IconStream,
  IconAddCamera,
  IconInfo,
} from '@millicast-react/dolbyio-icons';
import VideoView from '@millicast-react/video-view';
import ParticipantCount from '@millicast-react/participant-count';
import ShareLinkButton from '@millicast-react/share-link-button';
import ToggleButton from '@millicast-react/toggle-button';
import AddSource from '@millicast-react/add-source';
import LiveIndicator from '@millicast-react/live-indicator';
import Timer from '@millicast-react/timer';
import IconButton from '@millicast-react/icon-button';
import ActionBar from '@millicast-react/action-bar';
import Dropdown from '@millicast-react/dropdown';
import useCameraCapabilities, { Resolution } from './hooks/use-camera-capabilities';
import StatisticsInfo from '@millicast-react/statistics-info';

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

  const onSelectVideoResolution = useCallback(
    (resolution: Resolution) => {
      const videoConstraints = JSON.parse(JSON.stringify(cameraSettings));
      if (videoConstraints) {
        videoConstraints.width = resolution.width;
        videoConstraints.height = resolution.height;
      } else {
        return;
      }
      const audioConstraints = mediaStream?.getAudioTracks()[0].getSettings() ?? {};
      applyMediaTrackConstraints(audioConstraints, videoConstraints);
    },
    [resolutionList]
  );

  const toggleShare = () => {
    displayStream ? stopDisplayCapture() : startDisplayCapture();
  };

  const isActive = publisherState === 'streaming';

  return (
    <Flex direction="column" minH="100vh" w="100vw" bg="background" p="6">
      <Box w="100%" h="130px">
        <ActionBar title="Company name" />
        <Flex w="100%" justifyContent="space-between">
          <Box>
            <Timer isActive={isActive} />
            <LiveIndicator
              isActive={isActive}
              isLoading={publisherState === 'connecting'}
              start={() => {
                if (publisherState == 'ready' && mediaStream) {
                  startStreaming({
                    mediaStream,
                    simulcast: isSimulcastEnabled,
                    codec,
                    events: ['viewercount'],
                  });
                  if (displayStream) {
                    startDisplayStreaming({
                      mediaStream: displayStream,
                      sourceId: displayShareSourceId,
                    });
                  }
                }
              }}
              stop={() => {
                stopDisplayStreaming();
                stopStreaming();
              }}
            />
          </Box>
          <VStack>
            <Box>
              <ShareLinkButton linkText={linkText} />
            </Box>
            {isActive && (
              <Box mt="3">
                <ParticipantCount count={viewerCount} />
              </Box>
            )}
          </VStack>
        </Flex>
      </Box>
      <Flex flex="1" width="100%">
        <Stack direction="row" justifyContent="center" alignItems="center" w="100%" spacing="5">
          <Box position="relative">
            {publisherState !== 'streaming' && (
              <Box
                test-id="getStartedInfo"
                w="100%"
                textAlign="center"
                position="absolute"
                top="0"
                transform="translateY(-120%)"
              >
                <Heading test-id="getStartedInfoTitle" as="h2" fontSize="24px" fontWeight="600">
                  Get started
                </Heading>
                <Text test-id="getStartedInfoDesc" fontSize="15px" color="dolbySecondary.200" fontWeight="500">
                  Setup your audio and video before going live.
                </Text>
              </Box>
            )}
            <VideoView
              width="692px"
              height="384px"
              mirrored={true}
              muted={true}
              displayMuteButton={false}
              mediaStream={mediaStream}
              statistics={statistics}
              video={isVideoEnabled}
              label="Presenter"
              placeholderNode={
                <Box color="dolbyNeutral.700" position="absolute">
                  <IconProfile />
                </Box>
              }
            />
          </Box>
          {displayStream && <VideoView mediaStream={displayStream} />}
        </Stack>
      </Flex>
      <Box h="48px">
        <Flex direction="row" alignItems="center" justifyContent="space-between">
          {publisherState === 'streaming' && statistics && (
            <Popover placement="top">
              <PopoverTrigger>
                <Box>
                  <IconButton
                    test-id="streamInfoButton"
                    aria-label="Stream Information"
                    tooltip={{ label: 'Stream Information' }}
                    size="md"
                    className="icon-button"
                    icon={<IconInfo fill="white" />}
                  />
                </Box>
              </PopoverTrigger>
              <PopoverContent bg="dolbyNeutral.800">
                <PopoverArrow />
                <PopoverHeader color="white" alignContent="flex-start">
                  Streaming Information
                </PopoverHeader>
                <PopoverCloseButton color="white" />
                <PopoverBody>
                  <StatisticsInfo statistics={statistics} />
                </PopoverBody>
              </PopoverContent>
            </Popover>
          )}
          <Spacer />
          <Stack direction="row" flex="1" justifyContent="center">
            <IconButton
              test-id="toggleMicrophoneButton"
              tooltip={{ label: 'Toggle microphone' }}
              onClick={toggleAudio}
              isActive={!isAudioEnabled}
              isDisabled={!(mediaStream && mediaStream.getAudioTracks().length)}
              icon={isAudioEnabled ? <IconMicrophoneOn /> : <IconMicrophoneOff />}
            />
            <IconButton
              test-id="toggleCameraButton"
              tooltip={{ label: 'Toggle camera' }}
              onClick={toggleVideo}
              isActive={!isVideoEnabled}
              isDisabled={!(mediaStream && mediaStream.getVideoTracks().length)}
              icon={isVideoEnabled ? <IconCameraOn /> : <IconCameraOff />}
            />
          </Stack>
          <Flex direction="row" flex="1" justifyContent="flex-end" alignItems="center">
            <AddSource
              actions={[
                { icon: <IconPresent />, text: displayStream ? 'Stop share' : 'Share screen', onClick: toggleShare },
                {
                  icon: <IconAddCamera />,
                  text: 'Add cameras',
                  onClick: () => console.log('cameras'),
                  isDisabled: true,
                },
                {
                  icon: <IconStream />,
                  text: 'Stream local file',
                  onClick: () => console.log('stream'),
                  isDisabled: true,
                },
              ]}
            />
            <IconButton
              test-id="settingsButton"
              tooltip={{ label: 'Settings' }}
              onClick={onDrawerOpen}
              isDisabled={!(mediaStream && mediaStream.getVideoTracks().length)}
              icon={<IconSettings />}
              variant="transparent"
              ml={1}
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
                            data: device.deviceId,
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
                  {!isActive && codecList.length !== 0 && (
                    <Box>
                      <Dropdown
                        leftIcon={<IconCodec />}
                        disabled={publisherState !== 'ready' || codecList.length === 0}
                        testId="codecSelect"
                        elementsList={codecList}
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
                  {!isActive && (
                    <ToggleButton
                      test-id="simulcastSwitch"
                      onClick={() => setIsSimulcastEnabled(!isSimulcastEnabled)}
                      isActive={isSimulcastEnabled}
                      label="Simulcast"
                      leftIcon={<IconSimulcast />}
                    />
                  )}
                </Stack>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </Flex>
      </Box>
      <Box test-id="appVersion" position="fixed" bottom="5px" left="5px">
        <Text fontSize="12px">Version: {__APP_VERSION__} </Text>
      </Box>
    </Flex>
  );
}

export default App;
