import React, { useReducer, useState } from "react";
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
import usePublisher from "./hooks/usePublisher";
import IconCamera from "./components/Icons/Camera";
import IconCameraOff from "./components/Icons/CameraOff";
import type { Publisher, PublisherState } from './hooks/types/Publisher';


interface AppState {
  publishState: PublisherState;
  mediaStream?: MediaStream;
}

type PublishAction = "join" | "joined" | "goLive" | "stopLive";

function App() {
  const initialState: AppState = {
    publishState: "ready",
  };

  const [shouldRecord, setShouldRecord] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const [participantsCount] = useState(0);

  const streamToken = import.meta.env.VITE_MILLICAST_STREAM_ACCOUNT_ID;
  const streamId = import.meta.env.VITE_MILLICAST_STREAM_NAME;

  const { startStreaming, stopStreaming, publisherState } = usePublisher(streamToken, streamId);

  const reducer = (state: AppState, action: { type: PublishAction }) => {
    switch (action.type) {
      case "join": {
        // TODO: connect publisher
        const newState: AppState = { ...state, publishState: "connecting" };
        return newState;
      }
      case "joined": {
        const newState: AppState = { ...state, publishState: "ready" };
        return newState;
      }
      case "goLive": {
        // TODO: kick off streaming
        const newState: AppState = {
          ...state,
          publishState: "streaming",
        };
        return newState;
      }
      case "stopLive": {
        const newState: AppState = { ...state, publishState: "ready" };
        return newState;
      }
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

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
                state.publishState === "ready" && (
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
                state.publishState === "ready" && (
                  <Select placeholder="Select Camera">
                    <option value="option1">Camera 1</option>
                    <option value="option2">Camera 2</option>
                    <option value="option3">Camera 3</option>
                  </Select>
                )
              }
            </HStack>
            {state.publishState == "ready" ||
              state.publishState == "connecting" ? (
              <Button
                  isLoading={state.publishState == "connecting"}
                onClick={() => {
                  dispatch({ type: "join" });
                  setTimeout(() => {
                    dispatch({ type: "joined" });
                  }, 1000);
                }}
              >
                Join
              </Button>
            ) : undefined}
            {
              /** TODO: create a streaming control component */
              state.publishState == "ready" && (
                <Button onClick={() => dispatch({ type: "goLive" })}>
                  Go Live
                </Button>
              )
            }
            {state.publishState === "streaming" && (
              <>
                <Button onClick={() => dispatch({ type: "stopLive" })}>
                  Stop Live
                </Button>
                <Text> This is a timer </Text>
              </>
            )}
            {(state.publishState === "ready" ||
              state.publishState === "streaming") && (
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
