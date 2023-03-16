import { Menu, MenuButton, MenuList, MenuItem, Button, Box, Text } from '@chakra-ui/react';
import React from 'react';

import { IconAdd } from '@millicast-react/dolbyio-icons';

import { PopupMenuProps } from './types';

const PopupMenu = ({ buttonTitle, disabled = false, items }: PopupMenuProps) => {
  return (
    <Menu autoSelect={false} gutter={14} placement="top">
      <MenuButton
        _active={{
          bg: 'dolbyPurple.500',
          borderColor: 'dolbyPurple.500',
        }}
        _hover={{
          bg: 'dolbyPurple.500',
          borderColor: 'dolbyPurple.500',
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
        bg="dolbyNeutral.800"
        border="none"
        color="white"
        data-id="addSourceMenu"
        overflow="hidden"
        p="0"
        w="200px"
      >
        {items.map(({ icon, text, onClick, isDisabled }) => (
          <MenuItem
            _active={{ bg: 'dolbyNeutral.500' }}
            _focus={{ bg: 'dolbyNeutral.500' }}
            _hover={{ bg: 'dolbyNeutral.500' }}
            bg="dolbyNeutral.800"
            isDisabled={isDisabled}
            key={text}
            onClick={onClick}
            px={4}
            py={3}
            test-id={text.replace(/\s/g, '')}
          >
            <Box mr={3} width="24px">
              {icon}
            </Box>
            <Text fontSize="14px" fontWeight="500" noOfLines={1} textOverflow="ellipsis">
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
