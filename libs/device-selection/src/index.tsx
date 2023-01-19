import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Stack,
} from '@chakra-ui/react';
import React from 'react';

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
  return (
    // TODO: update device selection to design as per Figma
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalContent>
        <ModalHeader test-id="deviceSelectionTitle">Select source</ModalHeader>
        <ModalCloseButton test-id="deviceSelectionClose" />
        <ModalBody>
          <Stack direction="column" spacing={4}>
            <Box>
              <Dropdown
                elementResolver={deviceElementResolver}
                elementsList={cameraList}
                leftIcon={<IconCameraOn />}
                onSelect={handleSelectCamera}
                placeholder="Camera"
                selected={camera?.label}
                testId="camera-select"
              />
            </Box>
            <Box>
              <Dropdown
                elementResolver={deviceElementResolver}
                elementsList={microphoneList}
                leftIcon={<IconMicrophoneOn />}
                onSelect={handleSelectMicrophone}
                placeholder="Microphone"
                selected={microphone?.label}
                testId="microphone-select"
              />
            </Box>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button test-id="addDevice" isDisabled={!camera && !microphone} onClick={handleSubmit}>
            Add
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeviceSelection;
