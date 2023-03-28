import { Menu, MenuButton, MenuList, MenuItem, Button, Box, Text } from '@chakra-ui/react';
import React from 'react';

import { IconAdd } from '@millicast-react/dolbyio-icons';

import { PopupMenuProps } from './types';

const PopupMenu = ({ buttonTitle, disabled = false, items }: PopupMenuProps) => {
  return (
    <Menu placement="top" gutter={14} autoSelect={false}>
      <MenuButton
        _active={{
          borderColor: 'dolbyPurple.500',
          bg: 'dolbyPurple.500',
        }}
        _hover={{
          borderColor: 'dolbyPurple.500',
          bg: 'dolbyPurple.500',
        }}
        as={Button}
        bg="transparent"
        border="2px solid"
        disabled={disabled}
        fontSize="12px"
        iconSpacing={1}
        leftIcon={<IconAdd width="20px" />}
        lineHeight="20px"
        size="sm"
        test-id="addSourceButton"
        textTransform="uppercase"
      >
        {buttonTitle}
      </MenuButton>
      <MenuList
        data-id="addSourceMenu"
        bg="dolbyNeutral.800"
        w="200px"
        color="white"
        border="none"
        p="0"
        overflow="hidden"
      >
        {items.map(({ icon, text, onClick, isDisabled }) => (
          <MenuItem
            test-id={text.replace(/\s/g, '')}
            key={text}
            onClick={onClick}
            bg="dolbyNeutral.800"
            _hover={{ bg: 'dolbyNeutral.500' }}
            _active={{ bg: 'dolbyNeutral.500' }}
            _focus={{ bg: 'dolbyNeutral.500' }}
            isDisabled={isDisabled}
            px={4}
            py={3}
          >
            <Box width="24px" mr={3}>
              {icon}
            </Box>
            <Text noOfLines={1} textOverflow="ellipsis" fontSize="14px" fontWeight="500">
              {text}
            </Text>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export * from './types';
export default PopupMenu;
