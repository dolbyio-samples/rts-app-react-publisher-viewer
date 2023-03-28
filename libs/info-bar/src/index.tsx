import { Heading, HStack } from '@chakra-ui/react';
import React from 'react';

import ParticipantCount from '#millicast-react/participant-count';
import Timer from '#millicast-react/timer';

interface InfoBarProps {
  isActive?: boolean;
  numViewers: number;
  title: string;
}

const InfoBar = ({ numViewers, isActive = false, title }: InfoBarProps) => {
  return (
    <HStack
      alignItems="center"
      background="dolbyNeutral.800"
      borderRadius="8px"
      justifyContent="space-between"
      padding="8px 24px"
      test-id="actionBar"
      width="100%"
    >
      <HStack>
        <Heading as="h3" fontSize="16px" fontWeight={600} lineHeight={1.5} test-id="headingName">
          {title}
        </Heading>
      </HStack>
      <HStack gap="20px">
        {isActive ? <ParticipantCount count={numViewers} /> : undefined}
        <Timer isActive={isActive} />
      </HStack>
    </HStack>
  );
};

export default InfoBar;
