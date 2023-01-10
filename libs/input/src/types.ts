import { FormLabelProps, FormErrorMessageProps, HelpTextProps, InputProps as ChakraInputProps } from '@chakra-ui/react';

export interface InputProps {
  disabled?: boolean;
  error?: string;
  errorProps?: FormErrorMessageProps;
  helper?: string;
  helperProps?: HelpTextProps;
  inputProps?: ChakraInputProps;
  label: string;
  labelProps?: FormLabelProps;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  testId?: string;
  value: string;
}
