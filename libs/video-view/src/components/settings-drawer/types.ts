import type { VideoCodec } from '@millicast/sdk';

import { Resolution } from '@millicast-react/use-multi-media-devices';
import type { Bitrate } from '@millicast-react/use-publisher';
import type { SimulcastQuality } from '@millicast-react/use-viewer';

export interface SettingsDrawerProps {
  bitrate?: {
    handleSelect: (data: unknown) => void;
    isDisabled?: boolean;
    isHidden?: boolean;
    options: Bitrate[];
    value: string;
  };
  camera?: {
    handleSelect: (data: unknown) => void;
    isDisabled?: boolean;
    isHidden?: boolean;
    options: InputDeviceInfo[];
    value: string;
  };
  codec?: {
    handleSelect: (data: unknown) => void;
    isDisabled?: boolean;
    isHidden?: boolean;
    options: VideoCodec[];
    value: VideoCodec;
  };
  fullHeight?: boolean;
  isOpen: boolean;
  microphone?: {
    handleSelect: (data: unknown) => void;
    isDisabled?: boolean;
    isHidden?: boolean;
    options: InputDeviceInfo[];
    value: string;
  };
  name?: {
    handleChange: (data: unknown) => void;
    isDisabled?: boolean;
    isHidden?: boolean;
    value: string;
  };
  onClose: () => void;
  quality?: {
    handleSelect: (data: unknown) => void;
    isDisabled?: boolean;
    isHidden?: boolean;
    options: SimulcastQuality[];
    value: string;
  };
  resolution?: {
    handleSelect: (data: unknown) => void;
    isDisabled?: boolean;
    isHidden?: boolean;
    options: Resolution[];
    value: string;
  };
  simulcast?: {
    handleToggle: () => void;
    isDisabled?: boolean;
    isHidden?: boolean;
    value: boolean;
  };
}
