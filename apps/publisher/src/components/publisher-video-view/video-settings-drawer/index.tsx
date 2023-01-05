import { Box } from '@chakra-ui/react';
import React from 'react';

import { IconBitrate, IconCodec, IconResolution, IconSimulcast } from '@millicast-react/dolbyio-icons';
import Drawer from '@millicast-react/drawer';
import Dropdown from '@millicast-react/dropdown';
import Input from '@millicast-react/input';
import ToggleButton from '@millicast-react/toggle-button';

import { VideoSettingsDrawerProps } from './types';
import { bitrateElementResolver, codecElementResolver, resolutionElementResolver } from './utils';

const VideoSettingsDrawer = ({
  bitrate,
  codec,
  isOpen,
  name,
  onClose: handleClose,
  resolution,
  simulcast,
}: VideoSettingsDrawerProps) => (
  <Drawer
    fullHeight
    heading="Settings"
    headingProps={{ 'test-id': 'settingTitle' }}
    isOpen={isOpen}
    onClose={handleClose}
  >
    {name && !name.isHidden ? (
      <Box>
        <Input
          disabled={name.isDisabled}
          label="Source name"
          onChange={name.handleChange}
          testId="sourceName"
          value={name.value}
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
  </Drawer>
);

export * from './types';
export default VideoSettingsDrawer;
