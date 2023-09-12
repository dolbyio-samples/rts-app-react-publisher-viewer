import { IconButtonProps } from '@chakra-ui/react';

import { SimulcastQuality } from '@millicast-react/use-viewer';

interface SettingItem<T> {
  handleSelect: (data: unknown) => void;
  isDisabled?: boolean;
  isHidden?: boolean;
  options: T;
  value: string;
}
export interface SettingsPopoverProps {
  iconProps?: Omit<IconButtonProps, 'aria-label'>;
  quality?: SettingItem<SimulcastQuality[]>;
  sources?: SettingItem<{ id: string; label: string; data: { sourceId: string } }[]>;
}
