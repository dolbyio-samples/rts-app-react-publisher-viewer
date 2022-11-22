import { alertAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(alertAnatomy.keys);

const statusColors: Record<string, { backgroundColor: string; color: string }> = {
  error: {
    backgroundColor: 'dolbyFeedbackInvalid.500',
    color: 'dolbyFeedbackInvalid.900',
  },
};

const baseStyle = definePartsStyle((props) => {
  const { status } = props;
  return {
    container: {
      width: '400px',
      borderRadius: '6px',
      backgroundColor: statusColors?.[status]?.backgroundColor,
      padding: '3',
      paddingRight: '8',
    },
    icon: {
      color: statusColors?.[status]?.color,
    },
    title: {
      lineHeight: '15px',
      fontSize: '13px',
      color: statusColors?.[status]?.color,
    },
  };
});

const Alert = defineMultiStyleConfig({ baseStyle });

export default Alert;
