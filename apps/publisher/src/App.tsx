import { useEffect, useState, useCallback } from "react";
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
  Spacer,
  Switch,
  Text,
  VStack,
} from "@chakra-ui/react";
import usePublisher from "./hooks/usePublisher";
import useMediaDevices from "./hooks/useMediaDevices";
import IconMicrophoneOn from './components/Icons/Microphone';
import IconMicrophoneOff from './components/Icons/MicrophoneOff';
import IconCameraOn from "./components/Icons/Camera";
import IconCameraOff from "./components/Icons/CameraOff";
import IconSettings from "./components/Icons/Settings";

import MicrophoneSelect from "./components/MicrophoneSelect/MicrophoneSelect";
import CameraSelect from "./components/CameraSelect/CameraSelect";
import VideoView from './components/VideoView/VideoView';
import ParticipantCount from "./components/ParticipantCount/ParticipantCount";
import ShareLinkButton from "./components/ShareLinkButton/ShareLinkButton";


function App() {
  const [shouldRecord, setShouldRecord] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [streamId, setStreamId] = useState("");
  const [streamName, setStreamName] = useState("")

  const { startStreaming, stopStreaming, publisherState,viewerCount, linkText } = usePublisher(
    accessToken,
    streamName,
    streamId,
  );

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
  } = useMediaDevices();

  useEffect(() => {
    setAccessToken(import.meta.env.VITE_MILLICAST_STREAM_PUBLISHING_TOKEN);
    setStreamName(import.meta.env.VITE_MILLICAST_STREAM_NAME);
    setStreamId(import.meta.env.VITE_MILLICAST_STREAM_ID);
  }, []);

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
  const purple400 = "var(--chakra-colors-dolbyPurple-400)";

  return (
    <VStack w="100%">
      <Flex w="100%" gap="2" minWidth="max-content" alignItems="center">
        <Box>
          <Heading size="md" p="4">
            Dolbyio logo
          </Heading>
        </Box>
        <Spacer />
        {publisherState == "streaming" && <ParticipantCount count={viewerCount} />}
      </Flex>
      <Box>
        <Center>
          <VStack>
            <Box bg="black">
              <VideoView mediaStream={mediaStream}/>
            </Box>
            <HStack>
              <IconButton size='lg' p='4px'
                aria-label="toggle microphone"
                variant='outline'
                test-id='toggleAudioButton'
                isDisabled = { mediaStream && mediaStream.getAudioTracks().length ? false : true }
                icon={ isAudioEnabled ? (<IconMicrophoneOn fill={purple400} />) : (<IconMicrophoneOff fill='red' />)}
                onClick={() => { toggleAudio() }} />
              <IconButton
                size="lg" p='4px'
                aria-label="toggle camera"
                variant="outline"
                test-id='toggleVideoButton'
                isDisabled = { mediaStream && mediaStream.getVideoTracks().length ? false : true }
                icon={ isVideoEnabled ? (<IconCameraOn fill={purple400} />) : (<IconCameraOff fill="red" />)}
                onClick={() => { toggleVideo() }} />
              {/* Popover */}
              <Popover>
                <PopoverTrigger>
                  <IconButton
                    size='lg'
                    p='4px'
                    aria-label="settings"
                    variant="outline"
                    test-id='settingsButton'
                    icon={<IconSettings fill={purple400} />}
                  />
                </PopoverTrigger>
                <PopoverContent minWidth='480'>
                  <PopoverHeader pt={4} fontWeight='bold' border='0'>
                    Manage Your Devices
                  </PopoverHeader>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverBody>
                    <VStack>
                      <HStack width='100%'>
                        <Text> Camera: </Text>
                        <Spacer />
                        {publisherState === "ready" && cameraList.length && (
                          <CameraSelect
                            selectedCameraId={cameraId}
                            cameraList={cameraList}
                            onSelectCameraId={onSelectCameraId}
                          />
                        )}
                      </HStack>
                      <HStack width='100%'>
                        <Text> Microphone: </Text>
                        <Spacer />
                        {publisherState === "ready" && microphoneList.length && (
                          <MicrophoneSelect
                            selectedMicrophoneId={microphoneId}
                            microphoneList={microphoneList}
                            onSelectMicrophoneId={onSelectMicrophoneId}
                          />
                        )}
                      </HStack>
                    </VStack>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </HStack>
            {publisherState == "ready" || publisherState == "connecting" ? (
              <Button
                isLoading={publisherState == "connecting"}
                onClick={() => {
                  if (publisherState == "ready" && mediaStream) {
                    startStreaming({ mediaStream, events: ['viewercount'] });
                  }
                }}
                test-id="startStreamingButton"
              >
                Go Live
              </Button>
            ) : undefined}
            {publisherState === "streaming" && (
              <>
                <Button
                  test-id="stopStreamingButton"
                  onClick={() => {
                    stopStreaming();
                  }}
                >
                  Stop Live
                </Button>
                <Text> This is a timer </Text>
              </>
            )}
            {(publisherState === "ready" || publisherState === "streaming") && (
              <Switch onChange={() => setShouldRecord(!shouldRecord)}>
                enable recording
              </Switch>
            )}
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