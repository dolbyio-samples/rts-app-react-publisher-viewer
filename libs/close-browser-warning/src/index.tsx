import React, { useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Button,
  useDisclosure,
} from '@chakra-ui/react';

const CloseBrowserWarning = () => {
  useEffect(() => {
    // window.addEventListener('beforeunload', handleTabClose);

    // return () => {
    //   window.removeEventListener('beforeunload', handleTabClose);
    // };
    onbeforeunload = (event => {
      handleTabClose(event)
    })
  }, []);

  const handleTabClose = (event: BeforeUnloadEvent) => {
    // event.preventDefault();
    // event.stopImmediatePropagation()
    // event.stopPropagation();
    event.defaultPrevented
    // event.returnValue = false
    onOpen()
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Modal Title</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            You&#39;re leaving or refreshing the page. This will discontinue the streaming. Do you still want to do it?
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Stay on the page
          </Button>
          <Button variant="ghost">Leave anyway</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CloseBrowserWarning;
