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

const Input = ({ disabled, error, label, helper, onChange, placeholder, required, testId, value }: InputProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <FormControl isDisabled={disabled} isInvalid={!!error} isRequired={required} test-id={testId}>
      <FormLabel
        background="dolbyNeutral.800"
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
      >
        {label}
      </FormLabel>
      <InputGroup>
        <ChakraInput
          _focus={{ borderColor: 'dolbyPurple.400', boxShadow: 'none' }}
          _hover={{ borderColor: 'dolbyNeutral.500', boxShadow: 'none' }}
          bg="dolbyNeutral.800"
          border="2px solid"
          borderColor="dolbyNeutral.500"
          borderRadius="8px"
          fontSize="14px"
          fontWeight="500"
          height="48px"
          onChange={handleChange}
          placeholder={placeholder}
          px={3}
          py={5}
          textAlign="left"
          value={value}
          w="100%"
        />
        {value ? (
          <InputRightElement cursor="pointer" height="100%" onClick={handleClear}>
            <IconClose color="dolbyNeutral.500" height="12px" width="12px" />
          </InputRightElement>
        ) : null}
      </InputGroup>
      {helper ? <FormHelperText fontSize="12px">{helper}</FormHelperText> : null}
      {error ? <FormErrorMessage fontSize="12px">{error}</FormErrorMessage> : null}
    </FormControl>
  );
};

export * from './types';
export default Input;
