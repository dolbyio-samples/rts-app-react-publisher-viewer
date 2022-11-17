import { Stack, StackProps } from '@chakra-ui/react';
import IconButton, { IconButtonProps } from '@millicast-react/icon-button';
import React from 'react';

type ControlButtonProps = IconButtonProps & {
  key: string;
  ['test-id']?: string;
};

type ControlBarProps = StackProps & {
  controls: ControlButtonProps[];
};

const ControlBar = ({ controls, ...rest }: ControlBarProps) => {
  return (
    <Stack direction="row" flex="1" justifyContent="center" {...rest}>
      {controls.map((control) => (
        <IconButton
          key={control.key}
          test-id={control['test-id']}
          tooltip={control.tooltip}
          onClick={control.onClick}
          isActive={control.isActive}
          isDisabled={control.isDisabled}
          icon={control.icon}
        />
      ))}
    </Stack>
  );
};

export default ControlBar;
