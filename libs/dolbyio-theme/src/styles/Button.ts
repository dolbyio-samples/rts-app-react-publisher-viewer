import { defineStyleConfig } from '@chakra-ui/react';

const Button = defineStyleConfig({
  baseStyle: {
    _loading: {
      _hover: {
        bg: 'dolbyPurple.500',
      },
    },
    letterSpacing: '1px',
  },
  variants: {
    icon: {
      _active: { bg: 'dolbyNeutral.500', color: 'white' },
      bg: 'white',

      color: 'dolbyPurple.400',
    },
    iconReversed: {
      _active: { bg: 'white', color: 'dolbyPurple.400' },
      _hover: {
        bg: 'dolbyNeutral.500',
      },
      bg: 'dolbyNeutral.500',
      color: 'white',
    },
    link: {
      color: 'white',
    },
    outline: {
      borderColor: 'dolbyPurple.400',
    },
    solid: {
      _focus: {
        boxShadow: 'none',
      },
      _hover: {
        bg: 'dolbyPurple.500',
        boxShadow: '0 8px 14px rgba(106, 106, 109, 0.28)',
      },
      bg: 'dolbyPurple.400',
      color: 'white',
    },
    transparent: {
      _hover: {
        bg: 'dolbyNeutral.500',
      },
      bg: 'transparent',
      color: 'white',
      fontSize: '14px',
      px: '2',
      size: 'sm',
    },
  },
});

export default Button;
