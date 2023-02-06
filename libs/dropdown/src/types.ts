import { ReactNode } from 'react';

export interface DropdownProps {
  disabled?: boolean;
  elementResolver: (element: unknown) => Element | undefined;
  elementsList: unknown[];
  leftIcon?: ReactNode;
  onSelect: (data: Element['data']) => void;
  placeholder: string;
  rightIcon?: ReactNode;
  selected: string;
  testId?: string;
}

export interface Element {
  data: unknown;
  id: string;
  label: string;
}
