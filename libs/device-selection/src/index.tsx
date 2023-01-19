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
import VideoView from '@millicast-react/video-view';
import Dropdown from '@millicast-react/dropdown';
import { IconCameraOn, IconMicrophoneOn } from '@millicast-react/dolbyio-icons';

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
  onSubmit: handleSubmit,
}: DeviceSelectionProps) => {
  const [mediaStream, setMediaStream] = useState<MediaStream | undefined>();
  const updateVideoStream = async (camera: InputDeviceInfo) => {
    const constraints = {
      video: {
        deviceId: { exact: camera.deviceId },
      },
    };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    setMediaStream(stream);
  };

  useEffect(() => {
    if (camera) {
      updateVideoStream(camera);
    } else {
      setMediaStream(undefined);
    }
  }, [camera]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay>
        <ModalContent>
          <ModalCloseButton />
          <ModalBody p="2em">
            <VStack spacing={4}>
              <Heading as="h4" size="md">
                Add Source
              </Heading>
              <Text size="md" color="dolbyNeutral.300">
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
                  <VideoView mediaStream={mediaStream} />{' '}
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
              <Button isDisabled={!camera || !microphone} onClick={handleSubmit}>
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
