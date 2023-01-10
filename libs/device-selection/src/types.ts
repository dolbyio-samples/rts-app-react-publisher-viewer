export interface DeviceSelectionProps {
  camera?: InputDeviceInfo;
  cameraList?: InputDeviceInfo[];
  isOpen?: boolean;
  microphone?: InputDeviceInfo;
  microphoneList?: InputDeviceInfo[];
  onClose: () => void;
  onSelectCamera: (camera: InputDeviceInfo) => void;
  onSelectMicrophone: (microphone: InputDeviceInfo) => void;
  onSubmit: () => void;
}
