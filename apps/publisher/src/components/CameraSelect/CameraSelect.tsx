import React, { memo } from 'react';
import { Select } from "@chakra-ui/react";

type CameraSelectProps = {
    cameraList: InputDeviceInfo[];
    setCamera: (deviceId: string) => void;
    selectedCamera?: string;
}

const CameraSelect = ({cameraList, setCamera, selectedCamera}: CameraSelectProps) => {    
    return (
        <Select test-id="cameraSelect" placeholder="Select Camera" defaultValue={selectedCamera || cameraList[0].deviceId} onChange={(e) => setCamera(e.target.value)}>
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