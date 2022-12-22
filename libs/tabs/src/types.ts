import { TabListProps, TabPanelProps, TabProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

export interface TabsProps {
  tabListProps?: TabListProps;
  tabPanelProps?: TabPanelProps;
  tabs: {
    heading: string;
    id: string | number;
    children: ReactNode;
    tabPanelProps?: TabPanelProps;
    tabProps?: TabProps;
  }[];
}
