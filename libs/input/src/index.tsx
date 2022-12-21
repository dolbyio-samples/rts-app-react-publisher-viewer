import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input as ChakraInput,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import React, { ChangeEvent } from 'react';

import { IconClose } from '@millicast-react/dolbyio-icons';

import { InputProps } from './types';

const Input = ({
  disabled,
  error,
  errorProps = {},
  helper,
  helperProps = {},
  inputProps = {},
  label,
  labelProps = {},
  onChange,
  placeholder,
  required,
  testId,
  value,
}: InputProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <FormControl bg="inherit" isDisabled={disabled} isInvalid={!!error} isRequired={required} test-id={testId}>
      <FormLabel
        _disabled={{ opacity: 1 }}
        bg="inherit"
        fontSize="12px"
        fontWeight="500"
        left="12px"
        m="0"
        p="0 4px"
        pointerEvents="none"
        position="absolute"
        top={0}
        transform={'translateY(-50%)'}
        zIndex={2}
        {...labelProps}
      >
        {label}
      </FormLabel>
      <InputGroup>
        <ChakraInput
          _focus={{ borderColor: 'dolbyPurple.400', boxShadow: 'none' }}
          _hover={{ borderColor: 'dolbyNeutral.500', boxShadow: 'none' }}
          _placeholder={{ color: 'dolbySecondary.200' }}
          bg="inherit"
          border="2px solid"
          borderColor="dolbyNeutral.500"
          borderRadius="8px"
          fontSize="15px"
          fontWeight="500"
          maxHeight="48px"
          maxWidth="400px"
          onChange={handleChange}
          placeholder={placeholder}
          px={3}
          py={5}
          textAlign="left"
          value={value}
          w="100%"
          {...inputProps}
        />
        {value ? (
          <InputRightElement cursor="pointer" height="100%" onClick={handleClear}>
            <IconClose color="dolbyNeutral.500" height="12px" width="12px" />
          </InputRightElement>
        ) : null}
      </InputGroup>
      {helper ? (
        <FormHelperText fontSize="12px" {...helperProps}>
          {helper}
        </FormHelperText>
      ) : null}
      {error ? (
        <FormErrorMessage fontSize="12px" {...errorProps}>
          {error}
        </FormErrorMessage>
      ) : null}
    </FormControl>
  );
};

export * from './types';
export default Input;
