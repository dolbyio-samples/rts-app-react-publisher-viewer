import { extendTheme } from '@chakra-ui/react';
import Button from './styles/Button';

const dolbyioTheme = extendTheme({
  colors: {
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
  },
  components: {
    Button,
  },
});

export default dolbyioTheme;
