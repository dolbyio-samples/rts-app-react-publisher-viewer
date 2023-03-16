import { extendTheme } from '@chakra-ui/react';
import Button from './styles/Button';
import Heading from './styles/Heading';
import Text from './styles/Text';
import Tooltip from './styles/Tooltip';
import Alert from './styles/Alert';
import Modal from './styles/Modal';

const dolbyioTheme = extendTheme({
  colors: {
    background: '#14141A',
    backgroundTranslucent: '#14141A80',
    dolbyEmerald: {
      100: '#CFFEEB',
      200: '#A1FBD6',
      300: '#5CF2AF',
      400: '#00EB81',
      500: '#0BCB74',
      600: '#06B365',
    },
    dolbyFeedbackInvalid: {
      500: '#FCB91A',
      900: '#332400',
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
    dolbyPurple: {
      400: '#AA33FF',
      500: '#8829CC',
    },
    dolbyRed: {
      500: '#E52222',
    },
    dolbySecondary: {
      200: '#B9B9BA',
      500: '#6A6A6D',
    },
  },
  components: {
    Alert,
    Button,
    Heading,
    Modal,
    Text,
    Tooltip,
  },
  fonts: {
    body: 'Roboto, Helvetica, Arial, sans-serif',
    heading: 'Roboto, Helvetica, Arial, sans-serif',
    mono: 'Roboto, Helvetica, Arial, sans-serif',
  },
});

export default dolbyioTheme;
