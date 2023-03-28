import { Box, Center, ChakraProvider } from '@chakra-ui/react';
import { Meta, Story } from '@storybook/react';
import React from 'react';

import dolbyioTheme from '#millicast-react/dolbyio-theme';
import Tabs, { TabsProps } from '#millicast-react/tabs';

export default {
  component: Tabs,
} as Meta;

export const Default: Story = (args: TabsProps) => {
  return (
    <ChakraProvider theme={dolbyioTheme}>
      <Center bg="dolbyNeutral.800" height="300px">
        <Box width="600px">
          <Tabs {...args} />
        </Box>
      </Center>
    </ChakraProvider>
  );
};

Default.args = {
  tabListProps: {},
  tabPanelProps: {},
  tabs: [
    {
      children:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc molestie justo ac urna finibus finibus. Vivamus elementum nunc at dolor ornare luctus. Curabitur eget risus neque. Nullam dapibus quis mauris eu efficitur. Vestibulum pulvinar, elit quis bibendum tristique, augue leo euismod lacus, a rutrum orci sem vitae nisi.',
      heading: 'Tab 1',
      id: 0,
      tabPanelProps: { color: 'red' },
      tabProps: {},
    },
    {
      children:
        'Nam cursus aliquam urna, vel suscipit diam. Maecenas dapibus eros et risus imperdiet, et blandit nisi porta. Ut vitae dictum magna. Duis quis sodales nibh. Nunc vitae commodo mi. Duis et aliquet ante. Quisque purus purus, efficitur ut elit tincidunt, rutrum iaculis nulla. Nulla elementum quis dui eget efficitur.',
      heading: 'Tab 2',
      id: 1,
      tabPanelProps: { color: 'green' },
      tabProps: {},
    },
    {
      children:
        'Cras ornare facilisis tristique. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Sed et rhoncus libero, et auctor nulla. Nulla aliquam, metus aliquam lobortis porttitor, nulla eros tempor massa, vel molestie diam augue nec eros. Sed augue ante, tristique a erat sed, congue laoreet nibh.',
      heading: 'Tab 3',
      id: 1,
      tabPanelProps: { color: 'blue' },
      tabProps: {},
    },
  ],
};
