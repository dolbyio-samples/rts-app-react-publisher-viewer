import { Box, Flex, Text } from '@chakra-ui/react';
import { IconParticipant } from '@millicast-react/dolbyio-icons';
import React from 'react';

export type ParticipantCountProps = {
  count: string | number;
};

const ParticipantCount = ({ count }: ParticipantCountProps) => {
  return (
    <Flex test-id="participantCountView" color="dolbySecondary.200" alignItems="center">
      <Box boxSize={6}>
        <IconParticipant />
      </Box>
      <Text color="dolbySecondary.200" fontSize="14px" ml="2">
        {count} participants
      </Text>
    </Flex>
  );
};

export default ParticipantCount;
