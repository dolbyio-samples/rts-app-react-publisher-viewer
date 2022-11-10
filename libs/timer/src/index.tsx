import React, { memo, useEffect, useState } from 'react';
import { Flex, Text } from '@chakra-ui/react';
import LiveIndicator from '@millicast-react/live-indicator';

const initialSessionTime = '00:00';
let startTime = 0;
let currentTime = 0;
let interval: ReturnType<typeof setTimeout> | null = null;

export type TimerProps = {
  isActive: boolean;
};

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

        setSessionTime(`${hour > 0 ? `${formatTime(hour)}:` : ``}${formatTime(minute)}:${formatTime(second)}`);
      };

      startTime = Date.now();
      interval = setInterval(startTimer, 1000);
    } else {
      startTime = 0;
      currentTime = 0;
      setSessionTime(initialSessionTime);
    }

    return () => {
      if (interval !== null) {
        clearInterval(interval);
      }
    };
  }, [isActive]);

  return (
    <Flex test-id="timer" alignItems="center" gap="3">
      <Text fontSize="32px">{sessionTime}</Text>
      <LiveIndicator isActive={isActive} />
    </Flex>
  );
};

export default memo(Timer);
