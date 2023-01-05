import { Flex, IconButton as ChakraIconButton, Tooltip } from '@chakra-ui/react';
import React, { forwardRef, Ref } from 'react';

import { IconButtonProps } from './types';

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

export * from './types';
export default IconButton;
