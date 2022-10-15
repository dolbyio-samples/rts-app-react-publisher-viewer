import React, { useReducer, useState } from "react";
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  HStack,
  Select,
  Spacer,
  Switch,
  Text,
  VStack,
} from "@chakra-ui/react";

type PublishState = "Setup" | "Connecting" | "Ready" | "Streaming";

interface AppState {
  publishState: PublishState;
  mediaStream?: MediaStream;
}

type PublishAction = "join" | "joined" | "goLive" | "stopLive";

function App() {
  const initialState: AppState = {
    publishState: "Setup",
  };

  const [shouldRecord, setShouldRecord] = useState(false);
  const [participantsCount] = useState(0);

  const reducer = (state: AppState, action: { type: PublishAction }) => {
    switch (action.type) {
      case "join": {
        // TODO: connect publisher
        const newState: AppState = { ...state, publishState: "Connecting" };
        return newState;
      }
      case "joined": {
        const newState: AppState = { ...state, publishState: "Ready" };
        return newState;
      }
      case "goLive": {
        // TODO: kick off streaming
        const newState: AppState = {
          ...state,
          publishState: "Streaming",
        };
        return newState;
      }
      case "stopLive": {
        const newState: AppState = { ...state, publishState: "Ready" };
        return newState;
      }
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <VStack w="100%">
      <Flex w="100%" gap="2" minWidth="max-content" alignItems="center">
        <Box>
          <Heading size="md" p='4'> Dolbyio logo </Heading>
        </Box>
        <Spacer/>
        <Box p='4'>
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
              <Button minW='40'> Toggle Mic </Button>
              {
                // TODO: move to MicSelect component
                state.publishState === "Setup" && (
                  <Select placeholder="Select Microphone">
                    <option value="option1">Mic 1</option>
                    <option value="option2">Mic 2</option>
                    <option value="option3">Mic 3</option>
                  </Select>
                )
              }
            </HStack>
            <HStack>
              <Button minW='40'> Toggle Camera </Button>
              {
                // TODO: move to CameraSelect component
                state.publishState === "Setup" && (
                  <Select placeholder="Select Camera">
                    <option value="option1">Camera 1</option>
                    <option value="option2">Camera 2</option>
                    <option value="option3">Camera 3</option>
                  </Select>
                )
              }
            </HStack>
            {state.publishState == "Setup" || state.publishState == 'Connecting' ? (
              <Button
                isLoading = {state.publishState == 'Connecting'}
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
            state.publishState == "Ready" && (
              <Button onClick={() => dispatch({ type: "goLive" })}>
                Go Live
              </Button>
            ) }
             { state.publishState === 'Streaming' && (
              <>
              <Button onClick={() => dispatch({ type: "stopLive" })}>
                Stop Live
              </Button>
              <Text> This is a timer </Text>
              </>
            ) }
            { (state.publishState === 'Ready' || state.publishState === 'Streaming') &&
            (<Switch onChange={() => setShouldRecord(!shouldRecord)}> enable recording </Switch>) }
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
