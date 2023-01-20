import { Tab, TabList, TabPanel, TabPanels, Tabs as ChakraTabs } from '@chakra-ui/react';
import React from 'react';

import { TabsProps } from './types';

const Tabs = ({ tabListProps = {}, tabPanelProps = {}, tabsProps = {}, tabs }: TabsProps) => {
  return (
    <ChakraTabs isFitted {...tabsProps}>
      <TabList
        sx={{
          '&>button': {
            _selected: { borderColor: 'white', color: 'white', fontWeight: '600' },
            borderBottomWidth: '3px',
            borderColor: 'dolbySecondary.500',
            color: 'dolbySecondary.200',
            fontSize: '12px',
            fontWeight: '500',
            lineHeight: '16px',
            p: '0 0 4px',
          },
        }}
        {...tabListProps}
      >
        {tabs.map(({ heading, id, tabProps }) => (
          <Tab _active={{ bg: 'unset' }} key={id} {...tabProps}>
            {heading}
          </Tab>
        ))}
      </TabList>
      <TabPanels sx={{ '&>div': { padding: '12px 0 0' } }} {...tabPanelProps}>
        {tabs.map(({ id, children, tabPanelProps = {} }) => (
          <TabPanel test-id={id} key={id} {...tabPanelProps}>
            {children}
          </TabPanel>
        ))}
      </TabPanels>
    </ChakraTabs>
  );
};

export * from './types';
export default Tabs;
