import {
  Flex,
  IconButton as ChakraIconButton,
  IconButtonProps as ChakraIconButtonProps,
  Tooltip,
  TooltipProps,
} from '@chakra-ui/react';
import React from 'react';

export type IconButtonProps = Omit<ChakraIconButtonProps, 'onClick' | 'aria-label'> & {
  tooltip?: Omit<TooltipProps, 'children'> & {
    label: string;
  };
  onClick?: ChakraIconButtonProps['onClick'];
  icon: ChakraIconButtonProps['icon'];
  reversed?: boolean;
  'test-id': string;
};

const IconButton = ({ tooltip, onClick, icon, reversed, ...rest }: IconButtonProps) => {
  const renderButton = () => (
    <ChakraIconButton
      onClick={onClick}
      variant={reversed ? 'iconReversed' : 'icon'}
      icon={
        <Flex boxSize="24px" justifyContent="center" alignItems="center">
          {icon}
        </Flex>
      }
      size="lg"
      {...rest}
      aria-label={rest['test-id']}
    />
  );
  if (tooltip) {
    return <Tooltip {...tooltip}>{renderButton()}</Tooltip>;
  }
  return renderButton();
};

export default IconButton;
