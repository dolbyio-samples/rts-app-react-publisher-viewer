import { extendTheme } from '@chakra-ui/react';
import Button from './styles/Button';
import Heading from './styles/Heading';
import Text from './styles/Text';
import Tooltip from './styles/Tooltip';

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
      600: '#535359',
      700: '#36363B',
      800: '#292930',
    },
    dolbySecondary: {
      200: '#B9B9BA',
    },
    dolbyEmerald: {
      300: '#5CF2AF',
    },
  },
  components: {
    Button,
    Heading,
    Text,
    Tooltip,
  },
});

export default dolbyioTheme;
