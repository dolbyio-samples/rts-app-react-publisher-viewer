import { VideoViewProps } from '@millicast-react/video-view';

import { VideoSettingsDrawerProps } from './video-settings-drawer';

export interface ViewerVideoViewProps {
  disableSettings?: boolean;
  settingsProps: Omit<VideoSettingsDrawerProps, 'isOpen' | 'onClose'>;
  videoProps: VideoViewProps;
}
