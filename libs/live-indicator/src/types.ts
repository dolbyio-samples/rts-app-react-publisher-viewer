import { ButtonProps } from '@chakra-ui/react';

export interface LiveIndicatorProps extends ButtonProps {
  isActive: boolean;
  isLoading?: boolean;
  start?: () => void;
  stop?: () => void;
  testId?: string;
}
