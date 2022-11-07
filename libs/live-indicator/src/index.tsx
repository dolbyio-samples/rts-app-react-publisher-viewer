import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';

const LiveIndicator = () => {
  return (
    <Flex
      bgColor="dolbyRed.500"
      alignItems="center"
      justifyContent="center"
      gap="8px"
      borderRadius="6px"
      w="78px"
      h="32px"
    >
      <Box w="8px" h="8px" borderRadius="4px" bgColor="white"></Box>
      <Text color="white">LIVE</Text>
    </Flex>
  );
};

export default LiveIndicator;
