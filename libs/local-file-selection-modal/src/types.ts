import { FormEvent } from 'react';

export interface LocalFileSelectionModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent) => void;
}
