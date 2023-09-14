import { Heading, Text, VStack } from '@chakra-ui/react';
import * as React from 'react';

const NoStream = () => {
  return (
    <VStack>
      <Heading as="h2" fontSize="24px" fontWeight="600" test-id="pageHeader">
        Stream is not live
      </Heading>
      <Text test-id="pageDesc">Please wait for livestream to begin.</Text>
    </VStack>
  );
};

export default NoStream;
