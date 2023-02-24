import {
  Popover as ChakraPopover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
} from '@chakra-ui/react';
import React from 'react';

import IconButton from '@millicast-react/icon-button';

import { PopoverProps } from './types';

const Popover = ({ children, heading, icon, iconProps, label, placement }: PopoverProps) => {
  const camelCaseLabel = label
    .replace(/^./, (firstChar) => firstChar.toLowerCase())
    .replace(/\s+(\w)/, (_, char) => char.toUpperCase());

  return (
    <>
      <ChakraPopover isLazy placement={placement}>
        <PopoverTrigger>
          <IconButton
            aria-label={label}
            background="transparent"
            borderRadius="50%"
            icon={icon}
            isRound
            testId={`${camelCaseLabel}PopoverTrigger`}
            tooltipProps={{ label }}
            {...iconProps}
          />
        </PopoverTrigger>
        <Portal>
          <PopoverContent bg="dolbyNeutral.800" border="none" p={6} width="400px">
            {heading ? (
              <PopoverHeader
                border="none"
                color="white"
                fontSize="16px"
                fontWeight="600"
                mb="16px"
                p={0}
                test-id={`${camelCaseLabel}PopoverHeading`}
              >
                {heading}
              </PopoverHeader>
            ) : undefined}
            <PopoverCloseButton color="white" test-id={`${camelCaseLabel}PopoverCloseButton`} />
            <PopoverBody p={0}>{children}</PopoverBody>
          </PopoverContent>
        </Portal>
      </ChakraPopover>
    </>
  );
};

export default Popover;
