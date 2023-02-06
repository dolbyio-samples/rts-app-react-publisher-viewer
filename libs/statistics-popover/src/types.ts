import { IconButtonProps } from '@chakra-ui/react';
import { StreamStats } from '@millicast/sdk';

export interface StatisticsPopoverProps {
  iconProps?: Omit<IconButtonProps, 'aria-label'>;
  statistics?: StreamStats;
}

export type TabQualities = Array<'High' | 'Medium' | 'Low'>;
