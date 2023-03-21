import { IconButtonProps } from '@chakra-ui/react';
import { OnStats } from '@dolbyio/webrtc-stats';

export interface StatisticsPopoverProps {
  iconProps?: Omit<IconButtonProps, 'aria-label'>;
  statistics?: OnStats;
}

export type TabQualities = Array<'High' | 'Medium' | 'Low'>;
