import { modalAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(parts.keys);

const baseStyle = definePartsStyle({
  body: {
    bg: 'dolbyNeutral.700',
  },
  closeButton: {
    color: 'white',
  },
});

const Modal = defineMultiStyleConfig({
  baseStyle,
});

export default Modal;
