import React, { memo } from 'react';
import { Select } from "@chakra-ui/react";

type CameraSelectProps = {
    cameraList: InputDeviceInfo[];
    onSelectCameraId: (deviceId: string) => void;
    selectedCameraId?: string;
}

const CameraSelect = ({cameraList, onSelectCameraId, selectedCameraId}: CameraSelectProps) => {    
    return (
        <Select test-id="cameraSelect" placeholder="Select Camera" defaultValue={selectedCameraId || cameraList[0].deviceId} onChange={(e) => onSelectCameraId(e.target.value)}>
            {cameraList.map(camera => {
                return (
                    <option 
                        value={camera.deviceId} 
                        key={camera.deviceId}
                    >
                        {camera.label}
                    </option>
                )})}
        </Select>
    )
}

export default memo(CameraSelect);