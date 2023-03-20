import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  Heading,
  ModalOverlay,
  VStack,
  Text,
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';

import { IconCameraOn, IconMicrophoneOn } from '#millicast-react/dolbyio-icons';
import Dropdown from '#millicast-react/dropdown';
import VideoView from '#millicast-react/video-view';

import { DeviceSelectionProps } from './types';
import { deviceElementResolver } from './utils';

const DeviceSelection = ({
  camera,
  cameraList,
  isOpen = false,
  microphone,
  microphoneList,
  onClose: handleClose,
  onSelectCamera: handleSelectCamera,
  onSelectMicrophone: handleSelectMicrophone,
  onSubmit,
}: DeviceSelectionProps) => {
  const [mediaStream, setMediaStream] = useState<MediaStream | undefined>();

  useEffect(() => {
    if (camera) {
      updateVideoStream(camera);
    } else {
      resetMediaStream();
    }
  }, [camera]);

  const handleSubmit = () => {
    resetMediaStream();
    onSubmit();
  };

  const resetMediaStream = () => {
    setMediaStream((prevMediaStream) => {
      prevMediaStream?.getTracks().forEach((track) => {
        track.stop();
      });

      return undefined;
    });
  };

  const updateVideoStream = async (camera: InputDeviceInfo) => {
    const constraints = {
      video: { deviceId: { exact: camera.deviceId } },
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);

    setMediaStream(stream);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay>
        <ModalContent>
          <ModalCloseButton test-id="deviceSelectionClose" />
          <ModalBody p="2em">
            <VStack spacing={4}>
              <Heading as="h4" size="md" test-id="deviceSelectionTitle">
                Add Source
              </Heading>
              <Text color="dolbyNeutral.300" size="md">
                Select a camera and a microphone
              </Text>
              <Box width="100%">
                <Dropdown
                  elementResolver={deviceElementResolver}
                  elementsList={cameraList as unknown[]}
                  leftIcon={<IconCameraOn />}
                  onSelect={handleSelectCamera as (data: unknown) => void}
                  placeholder="Camera"
                  selected={camera?.label ?? ''}
                  testId="camera-select"
                />
              </Box>
              {mediaStream ? (
                <Box>
                  <VideoView mediaStream={mediaStream} />
                </Box>
              ) : undefined}
              <Box width="100%">
                <Dropdown
                  elementResolver={deviceElementResolver}
                  elementsList={microphoneList as unknown[]}
                  leftIcon={<IconMicrophoneOn />}
                  onSelect={handleSelectMicrophone as (data: unknown) => void}
                  placeholder="Microphone"
                  selected={microphone?.label ?? ''}
                  testId="microphone-select"
                />
              </Box>
              <Button isDisabled={!camera || !microphone} onClick={handleSubmit} test-id="addDevice">
                ADD TO STREAM
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};

export default DeviceSelection;
