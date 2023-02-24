import { TabListProps, TabPanelProps, TabProps, TabsProps as ChakraTabsProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

export interface TabsProps {
  tabListProps?: TabListProps;
  tabPanelProps?: TabPanelProps;
  tabsProps?: Omit<ChakraTabsProps, 'children'>;
  tabs: {
    heading: string;
    id: string | number;
    children: ReactNode;
    tabPanelProps?: TabPanelProps;
    tabProps?: TabProps;
  }[];
}
