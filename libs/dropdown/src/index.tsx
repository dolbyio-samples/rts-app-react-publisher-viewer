import React, { useMemo } from 'react';
import { Menu, MenuButton, MenuList, MenuItem, Button, Box, Text } from '@chakra-ui/react';
import { IconChevronDown, IconSuccessFilled } from '@millicast-react/dolbyio-icons';

type DropdownProps = {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  devicesList?: InputDeviceInfo[];
  elementsList?: string[];
  onSelect: (deviceId: string) => void;
  testId?: string;
  selected?: string;
  disabled?: boolean;
  placeholder: string;
};

const Dropdown = ({
  leftIcon,
  rightIcon = <IconChevronDown />,
  devicesList,
  elementsList,
  onSelect,
  testId,
  selected,
  disabled,
  placeholder,
}: DropdownProps) => {
  const selectedElement = useMemo(() => {
    if (devicesList) {
      return devicesList?.filter((i) => i.deviceId === selected)[0].label;
    }
    return selected;
  }, [devicesList, selected]);

  const elements = useMemo(() => {
    return devicesList || elementsList || [];
  }, [devicesList, elementsList]);

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
              ) : null
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
              {selectedElement || placeholder}
            </Text>
          </MenuButton>
          <MenuList bg="dolbyNeutral.700" border="none" borderTopRadius="none" pt="3">
            {elements.map((element) => {
              const label = typeof element === 'string' ? element : element.label;
              const id = typeof element === 'string' ? element : element.deviceId;
              return (
                <MenuItem
                  key={id}
                  onClick={() => onSelect(id)}
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
                  {selectedElement === label ? (
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
