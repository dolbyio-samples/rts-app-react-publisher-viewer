import { Flex, IconButton as ChakraIconButton, Tooltip } from '@chakra-ui/react';
import React, { forwardRef, Ref } from 'react';

import { IconButtonProps } from './types';

const IconButton = forwardRef(
  ({ icon, reversed, testId, tooltipProps, ...iconButtonProps }: IconButtonProps, ref: Ref<HTMLButtonElement>) => {
    const renderButton = () => (
      <ChakraIconButton
        aria-label={testId}
        icon={
          <Flex alignItems="center" boxSize="24px" justifyContent="center">
            {icon}
          </Flex>
        }
        size="lg"
        test-id={testId}
        variant={reversed ? 'iconReversed' : 'icon'}
        {...iconButtonProps}
        ref={ref}
      />
    );

    return tooltipProps ? <Tooltip {...tooltipProps}>{renderButton()}</Tooltip> : renderButton();
  }
);

IconButton.displayName = 'IconButton';

export * from './types';
export default IconButton;
