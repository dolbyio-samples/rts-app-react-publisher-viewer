import React, { memo } from "react";
import { Select } from "@chakra-ui/react";

interface MediaDeviceSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  deviceList: InputDeviceInfo[];
  onSelectDeviceId: (deviceId: string) => void;
  selectedDeviceId?: string;
  testId?: string;
  placeHolder?: string;
}

const MediaDeviceSelect = ({
  deviceList,
  onSelectDeviceId,
  selectedDeviceId,
  testId,
  placeHolder,
  ...props
}: MediaDeviceSelectProps) => {
  return (
    <Select
      disabled={props.disabled}
      test-id={testId}
      placeholder={placeHolder}
      defaultValue={selectedDeviceId || deviceList[0].deviceId}
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
