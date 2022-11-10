import { Meta, Story } from '@storybook/react';
import { ChakraProvider } from '@chakra-ui/react';
import dolbyioTheme from '@millicast-react/dolbyio-theme';
import ParticipantCount from '@millicast-react/participant-count';
import * as React from 'react';

export default {
  component: ParticipantCount,
} as Meta;

export const Default: Story = (args) => (
  <ChakraProvider theme={dolbyioTheme}>
    <ParticipantCount count={0} {...args} />
  </ChakraProvider>
);
Default.args = {
  count: 1,
};
