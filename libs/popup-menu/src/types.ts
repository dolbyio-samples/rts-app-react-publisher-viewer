import { ReactNode } from 'react';

export interface PopupMenuProps {
  buttonTitle: string;
  disabled?: boolean;
  items: {
    icon: ReactNode;
    isDisabled?: boolean;
    onClick: () => void;
    text: string;
  }[];
}
