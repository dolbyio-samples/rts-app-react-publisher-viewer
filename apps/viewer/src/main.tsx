import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import dolbyioTheme from '@millicast-react/dolbyio-theme';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

import App from './app';

const ErrorFallback = ({ error }: FallbackProps) => {
  return (
    <>
      <h2> `Got error: ${error.message}` </h2>
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={dolbyioTheme}>
      <ErrorBoundary fallbackRender={ErrorFallback}>
        <App />
      </ErrorBoundary>
    </ChakraProvider>
  </React.StrictMode>
);
