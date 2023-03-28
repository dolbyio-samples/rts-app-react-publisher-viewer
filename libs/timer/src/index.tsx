import { Box, Flex, Text } from '@chakra-ui/react';
import React, { memo, useEffect, useMemo, useReducer, useRef } from 'react';

export interface TimerProps {
  isActive: boolean;
}

interface TimeState {
  hour: number;
  minute: number;
  second: number;
}

const initialTime: TimeState = {
  hour: 0,
  minute: 0,
  second: 0,
};

const reducer = (state: TimeState, action: { type: 'reset' | 'tick' }): TimeState => {
  const { hour, minute, second } = state;

  switch (action.type) {
    case 'reset':
      return initialTime;

    case 'tick': {
      const newSecond = second + 1;
      const newMinute = minute + (newSecond >= 60 ? 1 : 0);
      const newHour = hour + (newMinute >= 60 ? 1 : 0);

      return { hour: newHour % 60, minute: newMinute % 60, second: newSecond % 60 };
    }
  }
};

const Timer = ({ isActive = false }: TimerProps) => {
  const timerRef = useRef<NodeJS.Timer>();

  const [time, dispatch] = useReducer(reducer, initialTime);

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

  const sessionTime = useMemo(() => {
    const { hour, minute, second } = time;

    return [hour, minute, second].map((number) => `${number}`.padStart(2, '0')).join(':');
  }, [time]);

  return (
    <Flex test-id="timer" alignItems="center">
      <Text fontSize="32px" lineHeight="1">
        {sessionTime}
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
