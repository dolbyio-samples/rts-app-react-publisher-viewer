import { Box, Flex, Text } from '@chakra-ui/react';
import { IconParicipant } from '@millicast-react/dolbyio-icons';
import React from 'react';

export type ParticipantCountProps = {
  count: string | number;
};
const ParticipantCount = ({ count }: ParticipantCountProps) => {
  const formatText = (count: string | number): string => {
    if (count == '1') {
      return `${count} viewer`;
    } else {
      return `${count} viewers`;
    }
  };
  return (
    <Flex bg="dolbyPurple.400" alignItems="center" test-id="participantCountView">
      <Box height="16px" width="24px">
        <IconParicipant fill="white" height="100%" width="100%" />
      </Box>
      <Text color="white" fontSize="14px" m={2}>
        {formatText(count)}
      </Text>
    </Flex>
  );
};

export default ParticipantCount;
