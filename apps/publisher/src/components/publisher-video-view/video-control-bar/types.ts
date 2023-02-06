import { StackProps } from '@chakra-ui/react';
import { StreamStats } from '@millicast/sdk';

import { StreamTypes } from '@millicast-react/use-multi-media-streams';

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
  onToggleAudio?: () => void;
  onTogglePlayback?: () => void;
  onToggleVideo?: () => void;
  settings?: SettingsPopoverProps;
  statistics?: StreamStats;
  streamType?: StreamTypes;
}
