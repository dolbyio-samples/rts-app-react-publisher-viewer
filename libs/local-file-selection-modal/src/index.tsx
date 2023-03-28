import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  Heading,
  ModalOverlay,
  VStack,
  Text,
  Center,
} from '@chakra-ui/react';
import React from 'react';

import { LocalFileSelectionModalProps } from './types';

const LocalFileSelectionModal = ({
  isOpen = false,
  onClose: handleClose,
  onSubmit: handleSubmit,
}: LocalFileSelectionModalProps) => {
  return (
    <Modal isCentered isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton test-id="localFileClose" />
        <ModalBody>
          <VStack>
            <form onSubmit={handleSubmit}>
              <Heading as="h4" test-id="addLocalFileTitle" size="md">
                Add local media file
              </Heading>
              <Text test-id="addLocalFileDesc" fontSize="md">
                Pick a local file
              </Text>
              <Center padding="16px 0 32px" sx={{ '#pickFile': { color: 'white' } }} width="100%">
                <input accept="video/*" id="pickFile" multiple={false} name="file" type="file" />
              </Center>
              <Button test-id="addStreamingFile" type="submit">
                ADD STREAMING FILE
              </Button>
            </form>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default LocalFileSelectionModal;
