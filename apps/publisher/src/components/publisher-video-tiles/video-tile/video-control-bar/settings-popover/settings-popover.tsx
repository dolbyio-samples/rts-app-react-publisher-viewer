import { Box } from '@chakra-ui/react';
import React from 'react';

import { IconBitrate, IconCodec, IconResolution, IconSettings, IconSimulcast } from '@millicast-react/dolbyio-icons';
import Dropdown from '@millicast-react/dropdown';
import Input from '@millicast-react/input';
import Popover from '@millicast-react/popover';
import ToggleButton from '@millicast-react/toggle-button';

import { SettingsPopoverProps } from './types';
import { bitrateElementResolver, codecElementResolver, resolutionElementResolver } from './utils';

const SettingsPopover = ({ bitrate, codec, iconProps, name, resolution, simulcast }: SettingsPopoverProps = {}) => (
  <Popover
    heading="Stream settings"
    icon={<IconSettings fill="white" />}
    iconProps={iconProps}
    label="Stream settings"
    placement="top-end"
  >
    {name && !name.isHidden ? (
      <Box>
        <Input
          disabled={name.isDisabled}
          inputProps={{ color: 'white' }}
          label="Source name"
          labelProps={{ background: 'dolbyNeutral.800', color: 'white' }}
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
          elementResolver={resolutionElementResolver}
          elementsList={resolution.options}
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
          elementResolver={bitrateElementResolver}
          elementsList={bitrate.options}
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
          elementResolver={codecElementResolver}
          elementsList={codec.options}
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
  </Popover>
);

export * from './types';
export default SettingsPopover;
