import React from 'react';
import { Select } from "@chakra-ui/react";

type CameraSelectType = {
    cameraList: InputDeviceInfo[];
}

const CameraSelect = ({cameraList}: CameraSelectType) => {
    return (
        <Select placeholder="Select Camera">
            {cameraList.map(camera => <option value={camera.deviceId} key={camera.deviceId}>{camera.label}</option>)}
        </Select>
    )
}

export default CameraSelect;