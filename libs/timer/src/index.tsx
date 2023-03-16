import React, { memo, useEffect, useState } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';

const initialSessionTime = '00:00:00';
let startTime = 0;
let currentTime = 0;
let interval: ReturnType<typeof setTimeout>;

export interface TimerProps {
  isActive: boolean;
}

const formatTime = (time: number) => {
  return time === 0 ? '00' : time.toLocaleString('en-US', { minimumIntegerDigits: 2 });
};

const Timer = ({ isActive = false }: TimerProps) => {
  const [sessionTime, setSessionTime] = useState(initialSessionTime);

  useEffect(() => {
    if (isActive) {
      const startTimer = () => {
        currentTime = Math.floor((Date.now() - startTime) / 1000);

        const hour = Math.floor(currentTime / 60 / 60);
        const minute = Math.floor((currentTime / 60) % 60);
        const second = Math.floor((currentTime % 60) % 60);

        setSessionTime(`${formatTime(hour)}:${formatTime(minute)}:${formatTime(second)}`);
      };

      startTime = Date.now();
      interval = setInterval(startTimer, 1000);
    } else {
      startTime = 0;
      currentTime = 0;
      setSessionTime(initialSessionTime);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isActive]);

  return (
    <Flex alignItems="center" test-id="timer">
      <Text fontSize="32px" lineHeight="1">
        {sessionTime}
      </Text>
      {isActive && <Box bg="dolbyRed.500" borderRadius="50%" h="8px" ml="2.5" test-id="streamStatus" w="8px" />}
    </Flex>
  );
};

export default memo(Timer);
