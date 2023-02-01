import { StreamStats } from '@millicast/sdk';

import { VideoViewProps } from '@millicast-react/video-view';

import { SettingsPopoverProps } from './video-control-bar/settings-popover';
import { SourceState } from '@millicast-react/use-publisher';

export interface PublisherVideoViewProps {
  canTogglePlayback?: boolean;
  onStartLive: () => void;
  onStopLive: () => void;
  settings?: SettingsPopoverProps;
  state?: SourceState;
  statistics?: StreamStats;
  videoProps: VideoViewProps;
}
