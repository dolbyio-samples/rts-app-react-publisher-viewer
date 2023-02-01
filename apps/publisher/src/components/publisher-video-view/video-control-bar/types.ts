import { StackProps } from '@chakra-ui/react';
import { StreamStats } from '@millicast/sdk';

import { SourceState } from '@millicast-react/use-publisher';

import { SettingsPopoverProps } from './settings-popover';

export interface VideoControlBarProps extends StackProps {
  audioTrack?: MediaStreamTrack;
  canTogglePlayback?: boolean;
  onStartLive: () => void;
  onStopLive: () => void;
  settings?: SettingsPopoverProps;
  state?: SourceState;
  statistics?: StreamStats;
  videoTrack?: MediaStreamTrack;
}
