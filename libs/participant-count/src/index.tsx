import { HStack, Text } from '@chakra-ui/react';
import { IconEye } from '@millicast-react/dolbyio-icons';
import React, { useMemo } from 'react';

export interface ParticipantCountProps {
  count: string | number;
}

const ParticipantCount = ({ count = 0 }: ParticipantCountProps) => {
  const participantCountText = useMemo(() => {
    if (Number(count) === 1) {
      return '1 Viewer';
    }

    return `${count} Viewers`;
  }, [count]);

  return (
    <HStack alignItems="center" color="dolbySecondary.200" test-id="participantCountView">
      <IconEye width="24px" />
      <Text color="dolbySecondary.200" fontSize="14px" fontWeight={500}>
        {participantCountText}
      </Text>
    </HStack>
  );
};

export default ParticipantCount;
