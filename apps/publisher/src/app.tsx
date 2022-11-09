import { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  HStack,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Select,
  Spacer,
  Switch,
  Text,
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
  IconStream,
} from '@millicast-react/dolbyio-icons';
import VideoView from '@millicast-react/video-view';
import ParticipantCount from '@millicast-react/participant-count';
import ShareLinkButton from '@millicast-react/share-link-button';
import MediaDeviceSelect from '@millicast-react/media-device-select';
import Timer from '@millicast-react/timer';
import React from 'react';
import LiveIndicator from '@millicast-react/live-indicator';
import ActionBar from '@millicast-react/action-bar';

const displayShareSourceId = 'DisplayShare';

function App() {
  const [isSimulcastEnabled, setIsSimulcastEnabled] = useState(false);

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
    setCameraId,
    setMicrophoneId,
    isAudioEnabled,
    isVideoEnabled,
    toggleAudio,
    toggleVideo,
    mediaStream,
    startDisplayCapture,
    stopDisplayCapture,
    displayStream,
  } = useMediaDevices();

  useEffect(() => {
    setupPublisher(
      import.meta.env.VITE_MILLICAST_STREAM_PUBLISHING_TOKEN,
      import.meta.env.VITE_MILLICAST_STREAM_NAME,
      import.meta.env.VITE_MILLICAST_STREAM_ID
    );
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

  const onSelectCameraId = useCallback(
    (deviceId: string) => {
      setCameraId(deviceId);
    },
    [cameraList]
  );

  const onSelectMicrophoneId = useCallback(
    (deviceId: string) => {
      setMicrophoneId(deviceId);
    },
    [microphoneList]
  );

  // Colors, our icon is not managed by ChakraUI, so has to use the CSS variable
  // TODO: move this to IconComponents
  const purple400 = 'var(--chakra-colors-dolbyPurple-400)';

  return (
    <VStack minH="100vh" w="100vw" bg="background" p="6">
      <Box w="100%" position="relative">
        <ActionBar
          name="Company name"
          action={
            publisherState == 'ready' || publisherState == 'connecting' ? (
              <Button
                test-id="startStreamingButton"
                px="2.5"
                h="28px"
                fontSize="12px"
                leftIcon={<IconStream height="16px" />}
                isLoading={publisherState == 'connecting'}
                onClick={() => {
                  if (publisherState == 'ready' && mediaStream) {
                    startStreaming({
                      mediaStream,
                      simulcast: isSimulcastEnabled,
                      codec,
                      events: ['viewercount'],
                    });
                    if (displayStream)
                      startDisplayStreaming({
                        mediaStream: displayStream,
                        sourceId: displayShareSourceId,
                      });
                  }
                }}
              >
                START
              </Button>
            ) : (
              <Button
                test-id="stopStreamingButton"
                px="2.5"
                h="28px"
                fontSize="12px"
                leftIcon={<IconStream height="16px" />}
                onClick={() => {
                  stopDisplayStreaming();
                  stopStreaming();
                }}
              >
                STOP
              </Button>
            )
          }
        />
        <Box position="absolute" left="0">
          <Timer start={publisherState === 'streaming'} />
        </Box>
        {publisherState === 'streaming' && (
          <Box position="absolute" right="0">
            <ParticipantCount count={viewerCount} />
          </Box>
        )}
      </Box>
      <Box>
        <Center>
          <VStack>
            <Box my="6" w="100%" textAlign="center">
              <Heading as="h2" fontSize="24px" fontWeight="600">
                Get started
              </Heading>
              <Text fontSize="15px" color="dolbySecondary.200" fontWeight="500">
                Setup your audio and video before going live.
              </Text>
            </Box>
            <HStack bg="black">
              <Box>
                <VideoView
                  mirrored={true}
                  muted={true}
                  displayMuteButton={false}
                  mediaStream={mediaStream}
                  statistics={statistics}
                />
              </Box>
              <Box display={displayStream ? 'block' : 'none'}>
                <VideoView mediaStream={displayStream} />
              </Box>
            </HStack>
            <HStack>
              <IconButton
                size="lg"
                p="4px"
                aria-label="toggle microphone"
                variant="outline"
                test-id="toggleAudioButton"
                isDisabled={!(mediaStream && mediaStream.getAudioTracks().length)}
                icon={isAudioEnabled ? <IconMicrophoneOn fill={purple400} /> : <IconMicrophoneOff fill="red" />}
                onClick={() => {
                  toggleAudio();
                }}
              />
              <IconButton
                size="lg"
                p="4px"
                aria-label="toggle camera"
                variant="outline"
                test-id="toggleVideoButton"
                isDisabled={!(mediaStream && mediaStream.getVideoTracks().length)}
                icon={isVideoEnabled ? <IconCameraOn fill={purple400} /> : <IconCameraOff fill="red" />}
                onClick={() => {
                  toggleVideo();
                }}
              />
              {/* Popover */}
              <Popover placement="top">
                <PopoverTrigger>
                  <IconButton
                    size="lg"
                    p="4px"
                    aria-label="settings"
                    variant="outline"
                    test-id="settingsButton"
                    icon={<IconSettings fill={purple400} />}
                  />
                </PopoverTrigger>
                <PopoverContent minWidth="360">
                  <PopoverHeader pt={4} fontWeight="bold" border="0">
                    Manage Your Devices
                  </PopoverHeader>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverBody>
                    <VStack>
                      <HStack width="100%">
                        <Text> Camera: </Text>
                        <Spacer />
                        {cameraList.length && (
                          <MediaDeviceSelect
                            disabled={publisherState === 'connecting'}
                            testId="camera-select"
                            deviceList={cameraList}
                            onSelectDeviceId={onSelectCameraId}
                          />
                        )}
                      </HStack>
                      <HStack width="100%">
                        <Text> Microphone: </Text>
                        <Spacer />
                        {microphoneList.length && (
                          <MediaDeviceSelect
                            disabled={publisherState === 'connecting'}
                            testId="microphone-select"
                            deviceList={microphoneList}
                            onSelectDeviceId={onSelectMicrophoneId}
                          />
                        )}
                      </HStack>
                      <HStack width="100%">
                        <Text> Codec </Text>
                        {
                          <Select
                            disabled={publisherState !== 'ready' || codecList.length === 0}
                            test-id="codecSelect"
                            defaultValue={codec || (codecList.length !== 0 ? codecList[0] : undefined)}
                            onChange={(e) => updateCodec(e.target.value)}
                          >
                            {codecList.map((codec: string) => {
                              return (
                                <option value={codec} key={codec}>
                                  {codec}
                                </option>
                              );
                            })}
                          </Select>
                        }
                      </HStack>
                      <Switch
                        test-id="simulcastSwitch"
                        onChange={() => setIsSimulcastEnabled(!isSimulcastEnabled)}
                        disabled={publisherState !== 'ready'}
                      >
                        Simulcast
                      </Switch>
                    </VStack>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </HStack>
            <HStack>
              <Button
                test-id="toggleDisplayCaptureButton"
                onClick={() => {
                  displayStream ? stopDisplayCapture() : startDisplayCapture();
                }}
              >
                {displayStream ? 'Stop Presenting' : 'Present'}
              </Button>
            </HStack>
            <ShareLinkButton linkText={linkText} />
          </VStack>
        </Center>
      </Box>
      <Box>
        <Text>Version: {__APP_VERSION__} </Text>
      </Box>
    </VStack>
  );
}

export default App;
