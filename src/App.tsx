import React, { useMemo, useReducer, useState } from "react";
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  HStack,
  IconButton,
  Select,
  Spacer,
  Switch,
  Text,
  VStack,
} from "@chakra-ui/react";
import usePublisher, { BroadcastOptions } from "./hooks/usePublisher";
import IconCamera from "./components/Icons/Camera";
import IconCameraOff from "./components/Icons/CameraOff";
import { useLocation } from 'react-router-dom';

import type { Publisher, PublisherState } from './hooks/usePublisher';

function App() {
  const location = useLocation();

  const accessToken = useMemo(() => {
    return encodeURIComponent(new URLSearchParams(window.location.search).get('publishingToken') || import.meta.env.VITE_MILLICAST_STREAM_PUBLISHING_TOKEN);
  }, [location]);

  const streamId = useMemo(() => {
    return encodeURIComponent(new URLSearchParams(window.location.search).get('streamName') || import.meta.env.VITE_MILLICAST_STREAM_NAME);
  }, [location]);


  const [shouldRecord, setShouldRecord] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const [participantsCount] = useState(0);

  const { startStreaming, stopStreaming, publisherState } = usePublisher(accessToken, streamId);

  // Colors, our icon is not managed by ChakraUI, so has to use the CSS variable
  // TODO: move this to IconComponents
  const purple400 = "var(--chakra-colors-dolbyPurple-400)";

  return (
    <VStack w="100%">
      <Flex w="100%" gap="2" minWidth="max-content" alignItems="center">
        <Box>
          <Heading size="md" p="4">
            {" "}
            Dolbyio logo{" "}
          </Heading>
        </Box>
        <Spacer />
        <Box p="4">
          <Text> Participant number: {participantsCount} </Text>
        </Box>
      </Flex>
      <Box>
        <Center>
          <VStack>
            {/* TODO: create a VideoView component */}
            <Box minH="640" minW="480" bg="black">
              <Text color="white"> This is the video view </Text>
            </Box>
            <HStack>
              <Button minW="40"> Toggle Mic </Button>
              {
                // TODO: move to MicSelect component
                publisherState === "ready" && (
                  <Select placeholder="Select Microphone">
                    <option value="option1">Mic 1</option>
                    <option value="option2">Mic 2</option>
                    <option value="option3">Mic 3</option>
                  </Select>
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
                // TODO: move to CameraSelect component
                publisherState === "ready" && (
                  <Select placeholder="Select Camera">
                    <option value="option1">Camera 1</option>
                    <option value="option2">Camera 2</option>
                    <option value="option3">Camera 3</option>
                  </Select>
                )
              }
            </HStack>
            {publisherState == "ready" ||
              publisherState == "connecting" ? (
              <Button
                  isLoading={publisherState == "connecting"}
                  onClick={(async () => {
                    // This needs to actually launch preview mode and not start streaming
                    await navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then((mediaDevice) => {
                      const broadcastOptions: BroadcastOptions = {
                        mediaStream: mediaDevice
                      }
                      startStreaming(broadcastOptions);
                    });
                  })}
              >
                Join
              </Button>
            ) : undefined}
            {
              /** TODO: create a streaming control component */
              publisherState == "ready" && (
                <Button onClick={() => {
                  // TODO 
                }

                }>
                  Go Live
                </Button>
              )
            }
            {publisherState === "streaming" && (
              <>
                <Button onClick={() => { stopStreaming(); }}>
                  Stop Live
                </Button>
                <Text> This is a timer </Text>
              </>
            )}
            {(publisherState === "ready" ||
              publisherState === "streaming") && (
              <Switch onChange={() => setShouldRecord(!shouldRecord)}>
                {" "}
                enable recording{" "}
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
