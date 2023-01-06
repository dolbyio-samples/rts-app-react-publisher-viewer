import { StreamStats } from '@millicast/sdk';

export interface StatisticsPopoverProps {
  statistics: StreamStats;
}

export type TabQualities = Array<'High' | 'Medium' | 'Low'>;
