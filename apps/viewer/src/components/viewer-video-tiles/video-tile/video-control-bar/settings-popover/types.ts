import { IconButtonProps } from '@chakra-ui/react';

import { SimulcastQuality } from '@millicast-react/use-viewer';

interface DropdownMenuItem<T> {
  handleSelect: (data: unknown) => void;
  isDisabled?: boolean;
  isHidden?: boolean;
  options: T;
  value: string;
}

interface ToggleItem {
  handleToggle: () => void;
  isDisabled?: boolean;
  isHidden?: boolean;
  value: boolean;
}

export interface SettingsPopoverProps {
  iconProps?: Omit<IconButtonProps, 'aria-label'>;
  quality?: DropdownMenuItem<SimulcastQuality[]>;
  sources?: DropdownMenuItem<{ id: string; label: string; data: { sourceId: string } }[]>;
  multiview?: ToggleItem;
}
