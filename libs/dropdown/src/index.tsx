import React from 'react';
import { Menu, MenuButton, MenuList, MenuItem, Button, Box, Text } from '@chakra-ui/react';
import { IconChevronDown, IconSuccessFilled } from '@millicast-react/dolbyio-icons';

type Element = {
  id: string;
  label: string;
  data: unknown;
};

type DropdownProps = {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  elementsList: unknown[];
  elementResolver: (element: unknown) => Element;
  onSelect: (data: Element['data']) => void;
  testId?: string;
  selected?: string;
  disabled?: boolean;
  placeholder: string;
};

const Dropdown = ({
  leftIcon,
  rightIcon = <IconChevronDown />,
  elementsList,
  elementResolver,
  onSelect,
  testId,
  selected,
  disabled,
  placeholder,
}: DropdownProps) => {
  return (
    <Menu matchWidth test-id={testId} gutter={-8}>
      {({ isOpen }) => (
        <>
          <MenuButton
            as={Button}
            leftIcon={
              leftIcon ? (
                <Box width="24px" color="dolbyNeutral.300">
                  {leftIcon}
                </Box>
              ) : undefined
            }
            rightIcon={<Box width="12px">{rightIcon}</Box>}
            w="100%"
            textAlign="left"
            disabled={disabled}
            border="2px solid"
            borderColor="dolbyNeutral.500"
            bg="dolbyNeutral.800"
            px={3}
            py={5}
            zIndex={isOpen ? 2 : undefined}
            _active={{ bg: 'dolbyNeutral.800' }}
            _hover={{ bg: 'dolbyNeutral.800' }}
          >
            <Text noOfLines={1} textOverflow="ellipsis" fontSize="14px" fontWeight="500">
              {placeholder} {selected ? ` - ${selected}` : null}
            </Text>
          </MenuButton>
          <MenuList bg="dolbyNeutral.700" border="none" borderTopRadius="none" pt="3">
            {elementsList.map((element) => {
              const { id, label, data } = elementResolver(element);
              return (
                <MenuItem
                  key={id}
                  onClick={() => onSelect(data)}
                  _active={{ bg: 'dolbyNeutral.600' }}
                  _focus={{ bg: 'dolbyNeutral.600' }}
                  _hover={{ bg: 'dolbyNeutral.600' }}
                  position="relative"
                  pr={10}
                  py={3}
                >
                  <Text as="div" noOfLines={1} textOverflow="ellipsis" fontSize="14px" fontWeight="500" w="100%">
                    {label}
                  </Text>
                  {selected === label ? (
                    <Box width="22px" color="dolbyEmerald.300" position="absolute" right={3}>
                      <IconSuccessFilled />
                    </Box>
                  ) : null}
                </MenuItem>
              );
            })}
          </MenuList>
        </>
      )}
    </Menu>
  );
};

export default Dropdown;
