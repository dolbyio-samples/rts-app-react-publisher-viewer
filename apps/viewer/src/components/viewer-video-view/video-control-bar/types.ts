import { StackProps } from '@chakra-ui/react';
import { StreamStats } from '@millicast/sdk';

import { SettingsPopoverProps } from './settings-popover';

export interface VideoControlBarProps extends StackProps {
  audioTrack?: MediaStreamTrack;
  isActive?: boolean;
  settings?: SettingsPopoverProps;
  statistics?: StreamStats;
  videoTrack?: MediaStreamTrack;
}
