import { TabListProps, TabPanelProps, TabProps, TabsProps as ChakraTabsProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

export interface TabsProps {
  tabListProps?: TabListProps;
  tabPanelProps?: TabPanelProps;
  tabs: {
    children: ReactNode;
    heading: string;
    id: string | number;
    tabPanelProps?: TabPanelProps;
    tabProps?: TabProps;
  }[];
  tabsProps?: Omit<ChakraTabsProps, 'children'>;
}
