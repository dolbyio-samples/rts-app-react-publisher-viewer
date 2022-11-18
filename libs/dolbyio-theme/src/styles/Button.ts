import { defineStyleConfig } from '@chakra-ui/react';

const Button = defineStyleConfig({
  baseStyle: {
    letterSpacing: '1px',
    _loading: {
      _hover: {
        bg: 'dolbyPurple.500',
      },
    },
  },
  variants: {
    solid: {
      color: 'white',
      _hover: {
        bg: 'dolbyPurple.500',
        boxShadow: '0 8px 14px rgba(106, 106, 109, 0.28)',
      },
      _focus: {
        boxShadow: 'none',
      },
      bg: 'dolbyPurple.400',
    },
    outline: {
      borderColor: 'dolbyPurple.400',
    },
    iconReversed: {
      color: 'white',
      bg: 'dolbyNeutral.500',
      _hover: {
        bg: 'dolbyNeutral.500',
      },
      _active: { bg: 'white', color: 'dolbyPurple.400' },
    },
    icon: {
      bg: 'white',
      color: 'dolbyPurple.400',

      _active: { color: 'white', bg: 'dolbyNeutral.500' },
    },
    transparent: {
      color: 'white',
      bg: 'transparent',
      fontSize: '14px',
      px: '2',
      size: 'sm',
      _hover: {
        bg: 'dolbyNeutral.500',
      },
    },
    link: {
      color: 'white',
    },
  },
});

export default Button;
