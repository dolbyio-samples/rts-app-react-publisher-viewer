import { extendTheme } from '@chakra-ui/react';
import Button from './styles/Button';

const dolbyioTheme = extendTheme({
  colors: {
    dolbyPurple: {
      400: '#aa33ff',
      500: '#8829CC',
    },
  },
  components: {
    Button,
  },
});

export default dolbyioTheme;
