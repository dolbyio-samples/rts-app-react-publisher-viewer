import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import dolbyioTheme from '@millicast-react/dolbyio-theme';

import App from './app';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={dolbyioTheme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);
