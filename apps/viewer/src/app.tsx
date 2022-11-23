import { Box, Button, Text, Center } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import Content from './components/content';

function App() {
  useEffect(() => {
    // prevent closing the page
    const pageCloseHandler = (event: BeforeUnloadEvent) => {
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', pageCloseHandler);

    return () => {
      window.removeEventListener('beforeunload', pageCloseHandler);
    };
  }, []);

  const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
    return (
      <Box borderWidth="1px" p="4">
        <Text fontSize="lg">Something went wrong:</Text>
        <Text fontSize="md" p="2">
          {error.message}
        </Text>
        <Center mt="4">
          <Button onClick={resetErrorBoundary}>Try again</Button>
        </Center>
      </Box>
    );
  };

  return (
    <ErrorBoundary fallbackRender={ErrorFallback}>
      <Content />
    </ErrorBoundary>
  );
}

export default App;
