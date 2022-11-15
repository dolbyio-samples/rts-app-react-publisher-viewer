import React, { memo } from 'react';
import { Select } from '@chakra-ui/react';

interface MediaDeviceSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  deviceList: InputDeviceInfo[];
  onSelectDeviceId: (deviceId: string) => void;
  testId?: string;
  defaultDeviceId?: string;
}

const MediaDeviceSelect = ({
  deviceList,
  onSelectDeviceId,
  testId,
  defaultDeviceId,
  ...props
}: MediaDeviceSelectProps) => {
  return (
    <Select
      disabled={props.disabled}
      test-id={testId}
      defaultValue={defaultDeviceId}
      onChange={(e) => onSelectDeviceId(e.target.value)}
    >
      {deviceList.map((device) => {
        return (
          <option value={device.deviceId} key={device.deviceId}>
            {device.label}
          </option>
        );
      })}
    </Select>
  );
};

export default memo(MediaDeviceSelect);
