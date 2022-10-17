import React, { useEffect, useReducer, useState, useRef, useMemo } from "react";
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

  const {cameraList, micList, selectedCamera, selectedMic, setCamera, setMic, mediaStream} = useMedia();

  const video = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (video?.current && (mediaStream instanceof MediaStream)) {
      video.current.srcObject = mediaStream;
    }
  }, [mediaStream])

  const setCamHandler = (groupId: string) => {
    const device = cameraList.filter(cam => cam.groupId === groupId)
    setCamera(device[0]);
  }

  const setMicHandler = (groupId: string) => {
    const device = micList.filter(mic => mic.groupId === groupId)
    setMic(device[0]);
  }

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
              <video autoPlay ref={video}/>
            </Box>
            <HStack>
              <Button minW='40'> Toggle Mic </Button>
              {
                state.publishState === "Setup" && micList.length ? (
                  <MicSelect selectedMic={selectedMic} micList={micList} setMicHandler={setMicHandler}/>
                ) : undefined
              }
            </HStack>
            <HStack>
              <Button minW='40'> Toggle Camera </Button>
              {
                state.publishState === "Setup" && cameraList.length ? (
                  <CameraSelect selectedCamera={selectedCamera} cameraList={cameraList} setCamHandler={setCamHandler}/>
              ) : undefined}
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
