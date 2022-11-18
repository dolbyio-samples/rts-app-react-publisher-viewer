import React from 'react';
import { Menu, MenuButton, MenuList, MenuItem, Button, Box, Text } from '@chakra-ui/react';
import { IconAdd } from '@millicast-react/dolbyio-icons';

type AddSourceProps = {
  items: {
    icon: React.ReactNode;
    text: string;
    onClick: () => void;
    isDisabled?: boolean;
  }[];
};

const PopupMenu = ({ items }: AddSourceProps) => {
  return (
    <Menu placement="top" gutter={14} autoSelect={false}>
      <MenuButton
        as={Button}
        textTransform="uppercase"
        size="sm"
        bg="transparent"
        border="2px solid"
        leftIcon={<IconAdd width="20px" />}
        iconSpacing={1}
        lineHeight="20px"
        fontSize="12px"
        _hover={{
          borderColor: 'dolbyPurple.500',
          bg: 'dolbyPurple.500',
        }}
        _active={{
          borderColor: 'dolbyPurple.500',
          bg: 'dolbyPurple.500',
        }}
      >
        Add source
      </MenuButton>
      <MenuList bg="dolbyNeutral.800" w="200px" color="white" border="none" p="0" overflow="hidden">
        {items.map(({ icon, text, onClick, isDisabled }) => (
          <MenuItem
            key={text}
            onClick={onClick}
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

export default PopupMenu;
