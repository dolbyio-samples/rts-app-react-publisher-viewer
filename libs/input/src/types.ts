import { FormLabelProps, FormErrorMessageProps, HelpTextProps, InputProps as ChakraInputProps } from '@chakra-ui/react';

export interface InputProps {
  disabled?: boolean;
  error?: string;
  errorProps?: FormErrorMessageProps;
  label: string;
  labelProps?: FormLabelProps;
  helper?: string;
  helperProps?: HelpTextProps;
  inputProps?: ChakraInputProps;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  testId?: string;
  value: string;
}
