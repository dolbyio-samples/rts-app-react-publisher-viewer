import { Heading, VStack } from '@chakra-ui/react';
import React from 'react';

import './styles/app.css';
const { VITE_RTS_ACCOUNT_ID, VITE_RTS_STREAM_NAME } = import.meta.env;
const App = () => {
  return (
    <VStack background="background" height="100%" padding="24px" spacing="24px" width="100%">
      <Heading as="h1" fontSize="32px" test-id="harnessHeader">
        Hosted Viewer Harness
      </Heading>
      <iframe
        src={`http://localhost:5173?streamId=${VITE_RTS_ACCOUNT_ID}/${VITE_RTS_STREAM_NAME}`}
        allowFullScreen
        width="640"
        height="480"
      ></iframe>
    </VStack>
  );
};

export default App;
