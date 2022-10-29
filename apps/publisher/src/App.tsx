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

import usePublisher from '@millicast-react/use-publisher';
import useMediaDevices from '@millicast-react/use-media-devices';
import {
  IconMicrophoneOn,
  IconMicrophoneOff,
  IconCameraOn,
  IconCameraOff,
  IconSettings,
} from '@millicast-react/dolbyio-icons';
import VideoView from '@millicast-react/video-view';
import ParticipantCount from '@millicast-react/participant-count';
import ShareLinkButton from '@millicast-react/share-link-button';
import MediaDeviceSelect from '@millicast-react/media-device-select';
import Timer from '@millicast-react/timer';
import React from 'react';

function App() {
  const displayShareSourceId = 'DisplayShare';
  const presenterSourceId = 'PresenterMedia';

  const [accessToken, setAccessToken] = useState('');
  const [streamId, setStreamId] = useState('');
  const [streamName, setStreamName] = useState('');
  const [isSimulcastEnabled, setIsSimulcastEnabled] = useState(false);

  const {
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
  } = usePublisher(accessToken, streamName, streamId);

  const {
    cameraList,
    microphoneList,
    cameraId,
    microphoneId,
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
    setAccessToken(import.meta.env.VITE_MILLICAST_STREAM_PUBLISHING_TOKEN);
    setStreamName(import.meta.env.VITE_MILLICAST_STREAM_NAME);
    setStreamId(import.meta.env.VITE_MILLICAST_STREAM_ID);
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
    <VStack w="100%">
      <Flex w="100%" gap="2" minWidth="max-content" alignItems="center">
        <Box>
          <Heading size="md" p="4">
            Dolbyio logo
          </Heading>
        </Box>
        <Spacer />
        {publisherState == 'streaming' && <ParticipantCount count={viewerCount} />}
      </Flex>
      <Box>
        <Center>
          <VStack>
            <HStack bg="black">
              <Box>
                <VideoView mediaStream={mediaStream} statistics={statistics} />
              </Box>
              <Box display={displayStream ? 'block' : 'none'}>
                <VideoView mirrored={false} mediaStream={displayStream} />
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
                            placeHolder="Select Camera"
                            selectedDeviceId={cameraId}
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
                            placeHolder="Select Microphone"
                            selectedDeviceId={microphoneId}
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
                            placeholder="Select Codec"
                            defaultValue={codec || (codecList.length !== 0 ? codecList[0] : undefined)}
                            onChange={e => updateCodec(e.target.value)}
                          >
                            {codecList.map(codec => {
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
              {(publisherState == 'ready' || publisherState == 'connecting') && (
                <Button
                  isLoading={publisherState == 'connecting'}
                  onClick={() => {
                    if (publisherState == 'ready' && mediaStream) {
                      startStreaming({
                        mediaStream,
                        simulcast: isSimulcastEnabled,
                        codec,
                        events: ['viewercount'],
                        sourceId: presenterSourceId,
                      });
                      if (displayStream)
                        startDisplayStreaming({
                          mediaStream: displayStream,
                          sourceId: displayShareSourceId,
                        });
                    }
                  }}
                  test-id="startStreamingButton"
                >
                  Go Live
                </Button>
              )}
              {publisherState === 'streaming' && (
                <>
                  <Button
                    test-id="stopStreamingButton"
                    onClick={() => {
                      stopDisplayStreaming();
                      stopStreaming();
                    }}
                  >
                    Stop Live
                  </Button>
                </>
              )}
              <Button
                test-id="toggleDisplayCaptureButton"
                onClick={() => {
                  displayStream ? stopDisplayCapture() : startDisplayCapture();
                }}
              >
                {displayStream ? 'Stop Presenting' : 'Present'}
              </Button>
            </HStack>
            {publisherState === 'streaming' && <Timer />}
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
