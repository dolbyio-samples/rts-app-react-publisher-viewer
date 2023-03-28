import {
  Alert as ChakraAlert,
  AlertProps as ChakraAlertProps,
  AlertTitle,
  AlertIcon,
  CloseButton,
} from '@chakra-ui/react';
import React, { SVGProps } from 'react';

import { IconClose, IconWarning } from '#millicast-react/dolbyio-icons';

type AlertProps = ChakraAlertProps & {
  message: string;
  onClose?: () => void;
};

const alertStatusIcons: Record<string, (props: SVGProps<SVGSVGElement>) => JSX.Element> = {
  error: IconWarning,
};

const Alert = ({ message, status, onClose }: AlertProps) => {
  return (
    <ChakraAlert status={status}>
      <AlertIcon as={status ? alertStatusIcons[status] : undefined} boxSize="22px" />
      <AlertTitle>{message}</AlertTitle>
      {onClose && (
        <CloseButton as={IconClose} boxSize="14px" cursor="pointer" onClick={onClose} position="absolute" right="3" />
      )}
    </ChakraAlert>
  );
};

export default Alert;
