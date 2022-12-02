import { Meta, Story } from '@storybook/react';
import { ChakraProvider } from '@chakra-ui/react';
import dolbyioTheme from '@millicast-react/dolbyio-theme';
import * as React from 'react';

export default {} as Meta;

export const Default: Story = () => (
  <ChakraProvider theme={dolbyioTheme}>
    <h1>Test</h1>
  </ChakraProvider>
);
