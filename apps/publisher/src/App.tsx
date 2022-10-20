import { useEffect, useState, useRef, useCallback } from "react";
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  HStack,
  IconButton,
  Spacer,
  Switch,
  Text,
  VStack,
} from "@chakra-ui/react";
import usePublisher, { BroadcastOptions } from "./hooks/usePublisher";
import useMediaDevices from './hooks/useMediaDevices';
import IconCamera from "./components/Icons/Camera";
import IconCameraOff from "./components/Icons/CameraOff";
import ParticipantCount from "./components/ParticipantCount/ParticipantCount";

import MicrophoneSelect from './components/MicrophoneSelect/MicrophoneSelect';
import CameraSelect from './components/CameraSelect/CameraSelect';


function App() {

  const [shouldRecord, setShouldRecord] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);

  const [accessToken, setAccessToken] = useState("");
  const [streamId, setStreamId] = useState("");

  useEffect(() => {
    setAccessToken(import.meta.env.VITE_MILLICAST_STREAM_PUBLISHING_TOKEN);
    setStreamId(import.meta.env.VITE_MILLICAST_STREAM_NAME);
  }, []);


  const { startStreaming, stopStreaming, publisherState, subscriberCount } = usePublisher(accessToken, streamId);

  const {cameraList, microphoneList, cameraId: camera, microphoneId: microphone, setCameraId: setCamera, setMicrophoneId: setMicrophone, mediaStream} = useMediaDevices();

  const video = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (video.current && mediaStream) {
      video.current.srcObject = mediaStream;
    }
  }, [mediaStream])

  const onSelectCamera = useCallback((deviceId: string) => {
    setCamera(deviceId);
  }, [cameraList])

  const onSelectMicrophone = useCallback((deviceId: string) => {
    setMicrophone(deviceId);
  }, [microphoneList])

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
        {publisherState == "streaming" && <ParticipantCount count={subscriberCount} /> }
      </Flex>
      <Box>
        <Center>
          <VStack>
            <Box minH="640" minW="480" bg="black">
              {/* eslint-disable-next-line react/no-unknown-property*/}
              <video playsInline test-id="videoFrame" autoPlay ref={video}/>
            </Box>
            <HStack>
              <Button minW="40"> Toggle Mic </Button>
              {
                publisherState === "ready" && microphoneList.length && (
                  <MicrophoneSelect selectedMicrophone={microphone} microphoneList={microphoneList} setMicrophone={onSelectMicrophone}/>
                )
              }
            </HStack>
            <HStack>
              <IconButton
                minW="40"
                size="md"
                aria-label="camera"
                variant="outline"
                icon={
                  cameraOn ? (
                    <IconCamera fill={purple400} />
                  ) : (
                    <IconCameraOff fill="red" />
                  )
                }
                onClick={() => {
                  setCameraOn(!cameraOn);
                }}
              >
                {" "}
                Toggle Camera{" "}
              </IconButton>
              {
                publisherState === "ready" && cameraList.length && (
                  <CameraSelect selectedCamera={camera} cameraList={cameraList} setCamera={onSelectCamera}/>
              )}
            </HStack>
            {publisherState == "ready" ||
              publisherState == "connecting" ? (
              <Button
                  isLoading={publisherState == "connecting"}
                  onClick={(async () => {
                    // TODO This needs to actually launch preview mode and not start streaming
                    await navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then((mediaDevice) => {
                      const broadcastOptions: BroadcastOptions = {
                      mediaStream: mediaDevice
                    }
                    startStreaming(broadcastOptions);
                  });
                  })}
                  test-id='startStreamingButton'
              >
                  Go Live
              </Button>
            ) : undefined}
            {publisherState === "streaming" && (
              <>
                <Button test-id="stopStreamingButton" onClick={() => { stopStreaming(); }}>
                  Stop Live
                </Button>
                <Text> This is a timer </Text>
              </>
            )}
            {(publisherState === "ready" ||
              publisherState === "streaming") && (
                <Switch onChange={() => setShouldRecord(!shouldRecord)}>
                  enable recording
                </Switch>
              )}
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
