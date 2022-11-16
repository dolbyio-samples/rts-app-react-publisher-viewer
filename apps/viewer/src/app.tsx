import { Box, Button, Flex, Heading, Spacer, VStack, Text, Center } from '@chakra-ui/react';
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
    <VStack w="100%" id="app">
      <Flex w="100%" gap="2" minWidth="max-content" alignItems="center">
        <Box>
          <Heading size="md" p="4" fontFamily="inherit">
            Dolbyio logo
          </Heading>
        </Box>
        <Spacer />
      </Flex>
      <ErrorBoundary fallbackRender={ErrorFallback}>
        <Content />
      </ErrorBoundary>
    </VStack>
  );
}

export default App;
