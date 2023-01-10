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
  selected: string;
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
            _active={{ bg: 'dolbyNeutral.800' }}
            _hover={{ bg: 'dolbyNeutral.800' }}
            as={Button}
            bg="dolbyNeutral.800"
            border="2px solid"
            borderColor="dolbyNeutral.500"
            borderRadius="8px"
            disabled={disabled}
            height="48px"
            leftIcon={
              leftIcon ? (
                <Box boxSize="24px" color="dolbyNeutral.300">
                  {leftIcon}
                </Box>
              ) : undefined
            }
            px={3}
            py={5}
            rightIcon={<Box boxSize="12px">{rightIcon}</Box>}
            test-id={testId + 'Default'}
            textAlign="left"
            w="100%"
            zIndex={isOpen ? 2 : undefined}
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
                  test-id={testId + 'Options'}
                  key={id}
                  onClick={() => onSelect(data)}
                  _active={{ bg: 'dolbyNeutral.600' }}
                  _focus={{ bg: 'dolbyNeutral.600' }}
                  _hover={{ bg: 'dolbyNeutral.600' }}
                  position="relative"
                  pr={10}
                  py={3}
                  bg="dolbyNeutral.700"
                >
                  <Text as="div" noOfLines={1} textOverflow="ellipsis" fontSize="14px" fontWeight="500" w="100%">
                    {label}
                  </Text>
                  {selected === label ? (
                    <Box boxSize="22px" color="dolbyEmerald.300" position="absolute" right={3}>
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
