import { Box, Flex, Text } from '@chakra-ui/react';
import { IconParicipant } from '@millicast-react/dolbyio-icons';
import React from 'react';

export type ParticipantCountProps = {
  count: string | number;
};
const ParticipantCount = ({ count }: ParticipantCountProps) => {
  return (
    <Flex bg="dolbyPurple.400" alignItems="center" test-id="participantCountView">
      <Box boxSize={12} p={2}>
        <IconParicipant fill="white" />
      </Box>
      <Text color="white" fontSize="2xl" m={2}>
        {count}
      </Text>
    </Flex>
  );
};

export default ParticipantCount;
