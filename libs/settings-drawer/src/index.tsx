import { Box, Flex, Heading, Slide, Stack } from '@chakra-ui/react';
import type { VideoCodec } from '@millicast/sdk';
import React from 'react';

import {
  IconBitrate,
  IconCameraOn,
  IconClose,
  IconCodec,
  IconMicrophoneOn,
  IconResolution,
  IconSimulcast,
} from '@millicast-react/dolbyio-icons';
import Dropdown from '@millicast-react/dropdown';
import IconButton from '@millicast-react/icon-button';
import ToggleButton from '@millicast-react/toggle-button';
import { Resolution } from '@millicast-react/use-multi-media-devices';
import type { Bitrate } from '@millicast-react/use-publisher';

import { SettingsDrawerProps } from './types';

const SettingsDrawer = ({
  bitrate,
  camera,
  codec,
  isOpen,
  microphone,
  onClose: handleDrawerClose,
  resolution,
  simulcast,
}: SettingsDrawerProps) => {
  const bitrateElementResolver = (element: unknown) => {
    const bitrateElement = element as Bitrate;
    return {
      data: bitrateElement.value,
      id: bitrateElement.name,
      label: bitrateElement.name,
    };
  };

  const deviceElementResolver = (element: unknown) => {
    const deviceElement = element as InputDeviceInfo;
    return {
      data: deviceElement,
      id: deviceElement.deviceId,
      label: deviceElement.label,
    };
  };

  const elementResolver = (element: unknown) => ({
    data: element as VideoCodec,
    id: element as string,
    label: element as string,
  });

  const resolutionElementResolver = (element: unknown) => {
    const resolution = element as Resolution;
    return {
      data: resolution,
      id: `${resolution.width}x${resolution.height}`,
      label: `${resolution.width}x${resolution.height}`,
    };
  };

  return (
    <Slide in={isOpen} style={{ position: 'absolute' }} unmountOnExit>
      <Flex
        bg="dolbyNeutral.800"
        color="white"
        flexDir="column"
        height="100%"
        position="absolute"
        right="0"
        width="320px"
      >
        <Heading as="h3" fontSize="20px" fontWeight={600} padding="16px 24px">
          Settings
        </Heading>
        <IconButton
          background="transparent"
          borderRadius="50%"
          icon={<IconClose fill="white" height="12px" width="12px" />}
          isRound
          onClick={handleDrawerClose}
          position="absolute"
          right="12px"
          size="sm"
          test-id="settingsCloseButton"
          top="8px"
        />
        <Box overflowY="auto">
          <Box height="100%" padding="8px 24px">
            <Stack direction="column" spacing={4}>
              {camera && camera.isVisible ? (
                <Box>
                  <Dropdown
                    disabled={camera.isDisabled}
                    elementsList={camera.options}
                    elementResolver={deviceElementResolver}
                    leftIcon={<IconCameraOn />}
                    onSelect={camera.handleSelect}
                    placeholder="Camera"
                    selected={camera.value}
                    testId="camera-select"
                  />
                </Box>
              ) : null}
              {microphone && microphone.isVisible ? (
                <Box>
                  <Dropdown
                    disabled={microphone.isDisabled}
                    elementsList={microphone.options}
                    elementResolver={deviceElementResolver}
                    leftIcon={<IconMicrophoneOn />}
                    onSelect={microphone.handleSelect}
                    placeholder="Microphone"
                    selected={microphone.value}
                    testId="microphone-select"
                  />
                </Box>
              ) : null}
              {codec && codec.isVisible ? (
                <Box>
                  <Dropdown
                    disabled={codec.isDisabled}
                    elementsList={codec.options}
                    elementResolver={elementResolver}
                    leftIcon={<IconCodec />}
                    onSelect={codec.handleSelect}
                    placeholder="Codec"
                    selected={codec.value}
                    testId="codecSelect"
                  />
                </Box>
              ) : null}
              {bitrate && bitrate.isVisible ? (
                <Box>
                  <Dropdown
                    disabled={bitrate.isDisabled}
                    elementsList={bitrate.options}
                    elementResolver={bitrateElementResolver}
                    leftIcon={<IconBitrate />}
                    onSelect={bitrate.handleSelect}
                    placeholder="Bitrate"
                    selected={bitrate.value}
                    testId="bitrateSelect"
                  />
                </Box>
              ) : null}
              {resolution && resolution.isVisible ? (
                <Box>
                  <Dropdown
                    disabled={resolution.isDisabled}
                    elementsList={resolution.options}
                    elementResolver={resolutionElementResolver}
                    leftIcon={<IconResolution />}
                    onSelect={resolution.handleSelect}
                    placeholder="Resolution"
                    selected={resolution.value}
                    testId="resolutionSelect"
                  />
                </Box>
              ) : null}
              {simulcast && simulcast.isVisible ? (
                <ToggleButton
                  isActive={simulcast.value}
                  isDisabled={simulcast.isDisabled}
                  label="Simulcast"
                  leftIcon={<IconSimulcast />}
                  onClick={simulcast.handleToggle}
                  test-id="simulcastSwitch"
                />
              ) : null}
            </Stack>
          </Box>
        </Box>
      </Flex>
    </Slide>
  );
};

SettingsDrawer.displayName = 'SettingsDrawer';

export * from './types';
export default SettingsDrawer;
