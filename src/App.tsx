import React, { useReducer, useState } from "react";
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  HStack,
  Spacer,
  Switch,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Director, Publish } from '@millicast/sdk';
import useMedia from './hooks/useMedia';

import MicSelect from './components/MicSelect/MicSelect';
import CameraSelect from './components/CameraSelect/CameraSelect';

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
  const [participantsCount, setParticipantsCount] = useState(0);

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

  const tokenGenerator = () => Director.getPublisher(
    {
      token: 'baa6b7694b65896d42acf625ca7e7e54e6e6167ec8b83c20bb4d11d1344ed15e', 
      streamName: 'new-stream-name'
    });
  const publisher = new Publish('new-stream-name', tokenGenerator);

  const [cameraList, micList] = useMedia()
  console.log(cameraList)
  console.log(micList)

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
                state.publishState === "Setup" ? (
                  <MicSelect micList={micList}/>
                ) : undefined
              }
            </HStack>
            <HStack>
              <Button minW='40'> Toggle Camera </Button>
              {
                state.publishState === "Setup" ? (
                  <CameraSelect cameraList={cameraList}/>
                ) : undefined
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
            state.publishState == "Ready" ? (
              <Button onClick={() => dispatch({ type: "goLive" })}>
                Go Live
              </Button>
            ) : undefined}
             { state.publishState === 'Streaming' ? (
              <>
              <Button onClick={() => dispatch({ type: "stopLive" })}>
                Stop Live
              </Button>
              <Text> This is a timer </Text>
              </>
            ): undefined }
            { state.publishState === 'Ready' || state.publishState === 'Streaming' ?
            (<Switch onChange={() => setShouldRecord(!shouldRecord)}> enable recording </Switch>) : undefined }
          </VStack>
        </Center>
      </Box>
    </VStack>
  );
}

export default App;
