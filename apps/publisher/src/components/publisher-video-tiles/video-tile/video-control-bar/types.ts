import { StackProps } from '@chakra-ui/react';
import { OnStats } from '@dolbyio/webrtc-stats';

import { StreamTypes } from 'apps/publisher/src/hooks/use-multi-media-streams';

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
  statistics?: OnStats;
  streamType?: StreamTypes;
}
