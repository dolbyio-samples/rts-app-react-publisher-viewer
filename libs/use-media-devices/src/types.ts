export interface StartDeviceProps {
  audioConstraints?: MediaTrackConstraints;
  audioDeviceId?: string;
  videoConstraints?: MediaTrackConstraints;
  videoDeviceId?: string;
}

export interface useMediaDevicesProps {
  filterUsedDevices?: boolean;
  handleError?: (error: string) => void;
}
