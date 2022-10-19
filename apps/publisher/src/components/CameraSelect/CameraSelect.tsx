import React, { memo } from 'react';
import { Select } from "@chakra-ui/react";

type CameraSelectProps = {
    cameraList: InputDeviceInfo[];
    setCamera: (groupId: string) => void;
    selectedCamera?: InputDeviceInfo;
}

const CameraSelect = ({cameraList, setCamera, selectedCamera}: CameraSelectProps) => {    
    return (
        <Select test-id="cameraSelect" placeholder="Select Camera" defaultValue={selectedCamera?.groupId || cameraList[0].groupId} onChange={(e) => setCamera(e.target.value)}>
            {cameraList.map(camera => {
                return (
                    <option 
                        value={camera.groupId} 
                        key={camera.groupId}
                    >
                        {camera.label}
                    </option>
                )})}
        </Select>
    )
}

export default memo(CameraSelect);