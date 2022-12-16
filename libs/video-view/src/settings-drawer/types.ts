import type { VideoCodec } from '@millicast/sdk';

import { Resolution } from '@millicast-react/use-multi-media-devices';
import type { Bitrate } from '@millicast-react/use-publisher';

export interface SettingsDrawerProps {
  bitrate?: {
    handleSelect: (data: unknown) => void;
    isDisabled: boolean;
    isVisible?: boolean;
    options: Bitrate[];
    value: string;
  };
  camera?: {
    handleSelect: (data: unknown) => void;
    isDisabled: boolean;
    isVisible?: boolean;
    options: InputDeviceInfo[];
    value: string;
  };
  codec?: {
    handleSelect: (data: unknown) => void;
    isDisabled: boolean;
    isVisible?: boolean;
    options: VideoCodec[];
    value: VideoCodec;
  };
  isOpen: boolean;
  microphone?: {
    handleSelect: (data: unknown) => void;
    isDisabled: boolean;
    isVisible?: boolean;
    options: InputDeviceInfo[];
    value: string;
  };
  onClose: () => void;
  resolution?: {
    handleSelect: (data: unknown) => void;
    isDisabled: boolean;
    isVisible?: boolean;
    options: Resolution[];
    value: string;
  };
  simulcast?: {
    handleToggle: () => void;
    isDisabled: boolean;
    isVisible?: boolean;
    value: boolean;
  };
}
