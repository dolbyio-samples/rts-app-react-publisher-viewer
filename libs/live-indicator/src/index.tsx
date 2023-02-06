import { Button } from '@chakra-ui/react';
import React from 'react';

import { LiveIndicatorProps } from './types';

const LiveIndicator = ({ isActive, isLoading, start, stop, testId, ...rest }: LiveIndicatorProps) => {
  return (
    <Button
      _hover={{
        bg: isActive ? 'dolbyRed.500' : 'dolbyEmerald.600',
      }}
      bg={isActive ? 'dolbyRed.500' : 'dolbyEmerald.600'}
      fontSize="12px"
      isLoading={isLoading}
      onClick={isActive ? stop : start}
      px="4"
      size="sm"
      test-id={testId ?? (isActive ? 'stop-live-indicator' : 'start-live-indicator')}
      textTransform="uppercase"
      {...rest}
    >
      {isActive ? 'STOP' : 'GO LIVE'}
    </Button>
  );
};

export * from './types';
export default LiveIndicator;
