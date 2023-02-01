import { StreamStats } from '@millicast/sdk';

import { VideoViewProps } from '@millicast-react/video-view';
import { SettingsPopoverProps } from './video-control-bar/settings-popover';

export interface ViewerVideoViewProps {
  isActive: boolean;
  settings?: SettingsPopoverProps;
  showControlBar?: boolean;
  statistics?: StreamStats;
  videoProps: VideoViewProps;
}
