import { ChakraProvider } from '@chakra-ui/react';
import { Meta, Story } from '@storybook/react';
import * as React from 'react';

import dolbyioTheme from '#millicast-react/dolbyio-theme';
import ParticipantCount from '#millicast-react/participant-count';

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
