import React, { memo } from 'react';
import { Select } from "@chakra-ui/react";

type CameraSelectProps = {
    cameraList: InputDeviceInfo[];
    setCameraId: (deviceId: string) => void;
    selectedCameraId?: string;
}

const CameraSelect = ({cameraList, setCameraId, selectedCameraId}: CameraSelectProps) => {    
    return (
        <Select test-id="cameraSelect" placeholder="Select Camera" defaultValue={selectedCameraId || cameraList[0].deviceId} onChange={(e) => setCameraId(e.target.value)}>
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