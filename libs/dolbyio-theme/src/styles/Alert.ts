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
      backgroundColor: statusColors?.[status]?.backgroundColor,
      borderRadius: '6px',
      padding: '3',
      paddingRight: '8',
      width: '400px',
    },
    icon: {
      color: statusColors?.[status]?.color,
    },
    title: {
      color: statusColors?.[status]?.color,
      fontSize: '13px',
      lineHeight: '15px',
    },
  };
});

const Alert = defineMultiStyleConfig({ baseStyle });

export default Alert;
