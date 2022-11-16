import { extendTheme } from '@chakra-ui/react';
import Button from './styles/Button';
import Heading from './styles/Heading';
import Text from './styles/Text';

const dolbyioTheme = extendTheme({
  fonts: {
    heading: `'Roboto', sans-serif`,
    body: `'Roboto', sans-serif;`,
  },
  colors: {
    background: '#14141A',
    dolbyPurple: {
      400: '#AA33FF',
      500: '#8829CC',
    },
    dolbyRed: {
      500: '#E52222',
    },
    dolbyGrey: {
      500: '#6A6A6D',
    },
    dolbyNeutral: {
      300: '#959599',
      500: '#6A6A6D',
      800: '#292930',
    },
    dolbySecondary: {
      200: '#B9B9BA',
    },
  },
  components: {
    Button,
    Heading,
    Text,
  },
  styles: {
    global: () => ({
      body: {
        bg: 'dolbyNeutral.800',
        color: 'white',
      },
    }),
  },
  fonts: {
    body: 'Roboto, Helvetica, Arial, sans-serif',
    heading: 'Roboto, Helvetica, Arial, sans-serif',
    mono: 'Roboto, Helvetica, Arial, sans-serif',
  },
});

export default dolbyioTheme;
