import { SimulcastQuality } from '@millicast-react/use-viewer';

export interface VideoSettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  quality?: {
    handleSelect: (data: unknown) => void;
    isDisabled?: boolean;
    isHidden?: boolean;
    options: SimulcastQuality[];
    value: string;
  };
}
