import { OnStats } from '@dolbyio/webrtc-stats';

import { VideoViewProps } from '@millicast-react/video-view';
import { SettingsPopoverProps } from './video-control-bar/settings-popover';

export interface VideoTileProps {
  controls: {
    audioEnabled: boolean;
    fullScreen: boolean;
    onChangeVolume?: (volume: number | ((prevVolume: number) => number)) => void;
    onToggleAudio?: (audioEnabled: boolean | ((prevAudioEnabled: boolean) => boolean)) => void;
    onToggleFullScreen?: (fullScreen: boolean | ((prevFullScreen: boolean) => boolean)) => void;
    onToggleVideo?: (videoEnabled: boolean | ((prevVideoEnabled: boolean) => boolean)) => void;
    videoEnabled: boolean;
    volume: number;
  };
  isStreaming?: boolean;
  settings?: SettingsPopoverProps;
  showControlBar?: boolean;
  statistics?: OnStats;
  videoProps?: VideoViewProps;
}
