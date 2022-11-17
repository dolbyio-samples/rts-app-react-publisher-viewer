import {
  Box,
  IconButton as ChakraIconButton,
  IconButtonProps as ChakraIconButtonProps,
  Tooltip,
  TooltipProps,
} from '@chakra-ui/react';
import React from 'react';

type IconButtonProps = Omit<ChakraIconButtonProps, 'onClick' | 'aria-label'> & {
  tooltip: Omit<TooltipProps, 'children'> & {
    label: string;
  };
  onClick?: ChakraIconButtonProps['onClick'];
  icon: ChakraIconButtonProps['icon'];
};

const IconButton = ({ tooltip: { label, ...restTooltip }, onClick, icon, ...rest }: IconButtonProps) => {
  return (
    <Tooltip label={label} {...restTooltip}>
      <ChakraIconButton
        aria-label={label}
        onClick={onClick}
        variant="icon"
        icon={<Box height="24px">{icon}</Box>}
        size="lg"
        {...rest}
      />
    </Tooltip>
  );
};

export default IconButton;
