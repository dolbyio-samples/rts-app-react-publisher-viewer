import { StackProps } from '@chakra-ui/react';
import { StreamStats } from '@millicast/sdk';

import { SettingsPopoverProps } from './settings-popover';

export interface VideoControlBarProps extends StackProps {
  activeAudio?: boolean;
  activePlayback?: boolean;
  activeVideo?: boolean;
  hasAudioTrack?: boolean;
  hasVideoTrack?: boolean;
  isStreaming?: boolean;
  onFullScreen?: () => void;
  settings?: SettingsPopoverProps;
  statistics?: StreamStats;
  toggleAudio?: () => void;
  togglePlayback?: () => void;
  toggleVideo?: () => void;
}
