import { IconButtonProps } from '@chakra-ui/react';

import { SimulcastQuality } from '#millicast-react/use-viewer';

export interface SettingsPopoverProps {
  iconProps?: Omit<IconButtonProps, 'aria-label'>;
  quality?: {
    handleSelect: (data: unknown) => void;
    isDisabled?: boolean;
    isHidden?: boolean;
    options: SimulcastQuality[];
    value: string;
  };
}
