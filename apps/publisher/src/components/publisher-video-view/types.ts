import { StreamStats } from '@millicast/sdk';

import { VideoViewProps } from '@millicast-react/video-view';

import { VideoSettingsDrawerProps } from './video-settings-drawer';

export interface PublisherVideoViewProps {
  isActive: boolean;
  settingsProps?: Omit<VideoSettingsDrawerProps, 'isOpen' | 'onClose'>;
  statistics?: StreamStats;
  videoProps: VideoViewProps;
}
