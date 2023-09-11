export interface Controls {
  audioEnabled: boolean;
  fullScreen: boolean;
  onChangeVolume?: (volume: number | ((prevVolume: number) => number)) => void;
  onToggleAudio?: (audioEnabled: boolean | ((prevAudioEnabled: boolean) => boolean)) => void;
  onToggleFullScreen?: (fullScreen: boolean | ((prevFullScreen: boolean) => boolean)) => void;
  onToggleVideo?: (videoEnabled: boolean | ((prevVideoEnabled: boolean) => boolean)) => void;
  videoEnabled: boolean;
  volume: number;
}
