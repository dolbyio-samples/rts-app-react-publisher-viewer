import { StreamStats } from '@millicast/sdk';

import { VideoViewProps } from '@millicast-react/video-view';
import { StreamTypes } from 'apps/publisher/src/hooks/use-multi-media-streams';

import { SettingsPopoverProps } from './video-control-bar/settings-popover';

export interface PublisherVideoViewProps {
  canTogglePlayback?: boolean;
  isConnecting?: boolean;
  isStreaming?: boolean;
  onRemove?: () => void;
  onStartLive: () => void;
  onStopLive: () => void;
  settings?: SettingsPopoverProps;
  statistics?: StreamStats;
  streamType?: StreamTypes;
  videoProps: VideoViewProps;
}
