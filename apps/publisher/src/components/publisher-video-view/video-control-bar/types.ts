import { StackProps } from '@chakra-ui/react';
import { StreamStats } from '@millicast/sdk';

import { SettingsPopoverProps } from './settings-popover';

export interface VideoControlBarProps extends StackProps {
  activeAudio?: boolean;
  activePlayback?: boolean;
  activeVideo?: boolean;
  canTogglePlayback?: boolean;
  hasAudioTrack?: boolean;
  hasVideoTrack?: boolean;
  isConnecting?: boolean;
  isStreaming?: boolean;
  onStartLive: () => void;
  onStopLive: () => void;
  settings?: SettingsPopoverProps;
  statistics?: StreamStats;
  toggleAudio?: () => void;
  togglePlayback?: () => void;
  toggleVideo?: () => void;
}
