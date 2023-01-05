import {
  Flex,
  IconButton as ChakraIconButton,
  IconButtonProps as ChakraIconButtonProps,
  Tooltip,
  TooltipProps,
} from '@chakra-ui/react';
import React, { forwardRef, Ref } from 'react';

export interface IconButtonProps extends Omit<ChakraIconButtonProps, 'aria-label'> {
  'aria-label'?: string;
  reversed?: boolean;
  testId: string;
  tooltipProps?: Omit<TooltipProps, 'children'> & {
    label: string;
  };
}

const IconButton = forwardRef(
  ({ icon, reversed, testId, tooltipProps, ...iconButtonProps }: IconButtonProps, ref: Ref<HTMLButtonElement>) => {
    const Button = (
      <ChakraIconButton
        aria-label={testId}
        icon={
          <Flex boxSize="24px" justifyContent="center" alignItems="center">
            {icon}
          </Flex>
        }
        size="lg"
        variant={reversed ? 'iconReversed' : 'icon'}
        {...iconButtonProps}
        ref={ref}
      />
    );

    return tooltipProps ? <Tooltip {...tooltipProps}>{Button}</Tooltip> : Button;
  }
);

IconButton.displayName = 'IconButton';

export default IconButton;
