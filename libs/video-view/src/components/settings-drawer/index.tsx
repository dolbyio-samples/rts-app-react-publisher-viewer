import { Box, Flex, Heading, Slide, Stack } from '@chakra-ui/react';
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
import Input from '@millicast-react/input';
import ToggleButton from '@millicast-react/toggle-button';

import { SettingsDrawerProps } from './types';
import {
  bitrateElementResolver,
  codecElementResolver,
  deviceElementResolver,
  qualityElementResolver,
  resolutionElementResolver,
} from './utils';

const SettingsDrawer = ({
  bitrate,
  camera,
  codec,
  drawerProps: { background, bg, ...drawerProps } = {},
  fullHeight,
  headingProps = {},
  isOpen,
  microphone,
  name,
  onClose: handleDrawerClose,
  quality,
  resolution,
  simulcast,
}: SettingsDrawerProps) => {
  const drawerBackground = background ?? bg ?? 'dolbyNeutral.800';

  return (
    <Slide in={isOpen} style={{ position: 'absolute' }} unmountOnExit>
      <Flex
        bg={drawerBackground}
        borderRadius="6px"
        bottom={0}
        color="white"
        flexDir="column"
        height={fullHeight ? '100%' : ''}
        position="absolute"
        right="0"
        width="346px"
        padding="24px 16px 48px"
        {...drawerProps}
      >
        <Heading as="h3" fontSize="20px" fontWeight={600} mb="16px" {...headingProps}>
          Settings
        </Heading>
        <IconButton
          background="transparent"
          borderRadius="50%"
          icon={<IconClose fill="white" height="16px" width="16px" />}
          isRound
          onClick={handleDrawerClose}
          position="absolute"
          right="12px"
          size="sm"
          test-id="settingsCloseButton"
          top="8px"
        />
        <Stack direction="column" height="100%" spacing={4} sx={{ '&>*': { bg: drawerBackground } }}>
          {name && !name.isHidden ? (
            <Box>
              <Input disabled={name.isDisabled} label="Source name" onChange={name.handleChange} value={name.value} />
            </Box>
          ) : undefined}
          {camera && !camera.isHidden ? (
            <Box>
              <Dropdown
                disabled={camera.isDisabled}
                elementsList={camera.options}
                elementResolver={deviceElementResolver}
                leftIcon={<IconCameraOn />}
                onSelect={camera.handleSelect}
                placeholder="Camera"
                selected={camera.value}
                testId="cameraSelect"
              />
            </Box>
          ) : undefined}
          {microphone && !microphone.isHidden ? (
            <Box>
              <Dropdown
                disabled={microphone.isDisabled}
                elementsList={microphone.options}
                elementResolver={deviceElementResolver}
                leftIcon={<IconMicrophoneOn />}
                onSelect={microphone.handleSelect}
                placeholder="Microphone"
                selected={microphone.value}
                testId="microphoneSelect"
              />
            </Box>
          ) : undefined}
          {bitrate && !bitrate.isHidden ? (
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
          ) : undefined}
          {codec && !codec.isHidden ? (
            <Box>
              <Dropdown
                disabled={codec.isDisabled}
                elementsList={codec.options}
                elementResolver={codecElementResolver}
                leftIcon={<IconCodec />}
                onSelect={codec.handleSelect}
                placeholder="Codec"
                selected={codec.value}
                testId="codecSelect"
              />
            </Box>
          ) : undefined}
          {resolution && !resolution.isHidden ? (
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
          ) : undefined}
          {quality && !quality.isHidden ? (
            <Box>
              <Dropdown
                disabled={quality.isDisabled}
                elementsList={quality.options}
                elementResolver={qualityElementResolver}
                leftIcon={<IconCameraOn />}
                onSelect={quality.handleSelect}
                placeholder="Quality"
                selected={quality.value}
                testId="qualitySelect"
              />
            </Box>
          ) : undefined}
          {simulcast && !simulcast.isHidden ? (
            <ToggleButton
              height="48px"
              isActive={simulcast.value}
              isDisabled={simulcast.isDisabled}
              label="Simulcast"
              leftIcon={<IconSimulcast />}
              onClick={simulcast.handleToggle}
              test-id="simulcastToggle"
            />
          ) : undefined}
        </Stack>
      </Flex>
    </Slide>
  );
};

export * from './types';
export default SettingsDrawer;
