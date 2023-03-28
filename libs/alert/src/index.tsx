import React, { SVGProps } from 'react';
import {
  Alert as ChakraAlert,
  AlertProps as ChakraAlertProps,
  AlertTitle,
  AlertIcon,
  CloseButton,
} from '@chakra-ui/react';

import { IconClose, IconWarning } from '@millicast-react/dolbyio-icons';

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
      <AlertIcon boxSize="22px" as={status ? alertStatusIcons[status] : undefined} />
      <AlertTitle>{message}</AlertTitle>
      {onClose && (
        <CloseButton cursor="pointer" position="absolute" right="3" boxSize="14px" as={IconClose} onClick={onClose} />
      )}
    </ChakraAlert>
  );
};

export default Alert;
