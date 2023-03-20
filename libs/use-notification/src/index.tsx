import { useToast } from '@chakra-ui/react';
import React from 'react';

import Alert from '#millicast-react/alert';

const useNotification = () => {
  const toast = useToast();

  const showError = (error: string) => {
    if (!toast.isActive(error)) {
      toast({
        duration: 5000,
        id: error,
        isClosable: true,
        position: 'top',
        render: ({ onClose }) => <Alert message={error} onClose={onClose} status="error" />,
      });
    }
  };

  return {
    showError,
  };
};

export default useNotification;
