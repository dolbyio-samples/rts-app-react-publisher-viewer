import { Menu, MenuButton, MenuList, MenuItem, Button, Box, Text } from '@chakra-ui/react';
import React from 'react';

import { IconChevronDown, IconSuccessFilled } from '@millicast-react/dolbyio-icons';

import { DropdownProps, Element } from './types';

const Dropdown = ({
  disabled,
  elementResolver,
  elementsList,
  leftIcon,
  onSelect,
  placeholder,
  rightIcon = <IconChevronDown />,
  selected,
  testId,
}: DropdownProps) => {
  const resolvedElements = elementsList.reduce((accResolvedElements: Element[], currElement: unknown) => {
    const resolvedElement = elementResolver(currElement);

    if (!resolvedElement) {
      return accResolvedElements;
    }

    return [...accResolvedElements, resolvedElement];
  }, [] as Element[]);

  return (
    <Menu gutter={-8} matchWidth test-id={testId}>
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
            <Text fontSize="14px" fontWeight="500" noOfLines={1} textOverflow="ellipsis">
              {placeholder} {selected ? ` - ${selected}` : null}
            </Text>
          </MenuButton>
          <MenuList bg="dolbyNeutral.700" border="none" borderTopRadius="none" pt="3">
            {resolvedElements.map(({ data, id, label }) => (
              <MenuItem
                _active={{ bg: 'dolbyNeutral.600' }}
                _focus={{ bg: 'dolbyNeutral.600' }}
                _hover={{ bg: 'dolbyNeutral.600' }}
                bg="dolbyNeutral.700"
                key={id}
                onClick={() => onSelect(data)}
                position="relative"
                pr={10}
                py={3}
                test-id={testId + 'Options'}
              >
                <Text as="div" fontSize="14px" fontWeight="500" noOfLines={1} textOverflow="ellipsis" w="100%">
                  {label}
                </Text>
                {selected === label ? (
                  <Box boxSize="22px" color="dolbyEmerald.300" position="absolute" right={3}>
                    <IconSuccessFilled />
                  </Box>
                ) : null}
              </MenuItem>
            ))}
          </MenuList>
        </>
      )}
    </Menu>
  );
};

export * from './types';
export default Dropdown;
