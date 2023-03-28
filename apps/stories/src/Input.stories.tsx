import { Box, ChakraProvider } from '@chakra-ui/react';
import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';

import dolbyioTheme from '@millicast-react/dolbyio-theme';
import Input, { InputProps } from '@millicast-react/input';

export default {
  component: Input,
} as Meta;

export const Default: Story = (args: InputProps) => {
  const [value, setValue] = useState('');

  return (
    <ChakraProvider theme={dolbyioTheme}>
      <Box bg="white">
        <Input onChange={setValue} value={value} {...args} />
      </Box>
    </ChakraProvider>
  );
};

Default.args = {
  disabled: false,
  error: '',
  errorProps: {},
  label: 'Input label',
  labelProps: {},
  helper: '',
  helperProps: {},
  inputProps: {},
  placeholder: '',
  required: true,
};
