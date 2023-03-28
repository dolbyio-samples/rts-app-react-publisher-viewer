import { IconButtonProps } from '@chakra-ui/react';
import { VideoCodec } from '@millicast/sdk';

import { Bitrate } from '@millicast-react/use-publisher';
import { Resolution } from 'apps/publisher/src/hooks/use-multi-media-streams';

export interface SettingsPopoverProps {
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
  iconProps?: Omit<IconButtonProps, 'aria-label'>;
  name?: {
    handleChange: (data: unknown) => void;
    isDisabled?: boolean;
    isHidden?: boolean;
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
