import React from 'react';
import { Select } from "@chakra-ui/react";

type MicSelectType = {
    micList: InputDeviceInfo[];
}

const MicSelect = ({micList}: MicSelectType) => {
    return (
        <Select placeholder="Select Microphone">
            {micList.map(mic => <option value={mic.deviceId} key={mic.deviceId}>{mic.label}</option>)}
        </Select>
    )
}

export default MicSelect;