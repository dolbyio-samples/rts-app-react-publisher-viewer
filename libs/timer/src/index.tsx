import { Box, Flex, Text } from '@chakra-ui/react';
import React, { memo, useEffect, useReducer, useRef } from 'react';

export interface TimerProps {
  isActive: boolean;
}

const initialSessionTime = ['00', '00', '00'];

const reducer = (state: string[], action: { type: 'reset' | 'tick' }): string[] => {
  const [hour, minute, second] = state.map(Number);

  switch (action.type) {
    case 'reset':
      return initialSessionTime;

    case 'tick': {
      const newSecond = second + 1;
      const newMinute = minute + (newSecond >= 60 ? 1 : 0);
      const newHour = hour + (newMinute >= 60 ? 1 : 0);

      return [newHour, newMinute, newSecond].map((number) => `${number % 60}`.padStart(2, '0'));
    }
  }
};

const Timer = ({ isActive = false }: TimerProps) => {
  const timerRef = useRef<NodeJS.Timer>();

  const [sessionTime, dispatch] = useReducer(reducer, initialSessionTime);

  useEffect(() => {
    if (!isActive) {
      clearInterval(timerRef.current);
      dispatch({ type: 'reset' });

      return;
    }

    timerRef.current = setInterval(() => dispatch({ type: 'tick' }), 1000);

    return () => {
      clearInterval(timerRef.current);
    };
  }, [isActive]);

  return (
    <Flex test-id="timer" alignItems="center">
      <Text fontSize="32px" lineHeight="1">
        {sessionTime.join(':')}
      </Text>
      <Box
        background="dolbyRed.500"
        borderRadius="50%"
        height="8px"
        lineHeight="1.25"
        marginLeft="2.5"
        test-id="streamStatus"
        visibility={isActive ? 'visible' : 'hidden'}
        width="8px"
      />
    </Flex>
  );
};

export default memo(Timer);
