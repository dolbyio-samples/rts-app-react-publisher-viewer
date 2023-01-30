import { VideoCodec } from '@millicast/sdk';

import { Bitrate, Resolution } from '@millicast-react/use-multi-media-streams';

export interface VideoSettingsDrawerProps {
  bitrate?: {
    handleSelect: (data: unknown) => void;
    isDisabled?: boolean;
    isHidden?: boolean;
    options: Bitrate[];
    value: string;
  };
  codec?: {
    handleSelect: (data: unknown) => void;
    isDisabled?: boolean;
    isHidden?: boolean;
    options: VideoCodec[];
    value: VideoCodec;
  };
  isOpen: boolean;
  name?: {
    handleChange: (data: unknown) => void;
    isDisabled?: boolean;
    isHidden?: boolean;
    value: string;
  };
  onClose: () => void;
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
