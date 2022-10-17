import React from 'react';
import { Select } from "@chakra-ui/react";

type CameraSelectType = {
    cameraList: InputDeviceInfo[];
    setCamHandler: (groupId: string) => void;
    selectedCamera?: InputDeviceInfo;
}

const CameraSelect = ({cameraList, setCamHandler, selectedCamera}: CameraSelectType) => {    
    return (
        <Select placeholder="Select Camera" defaultValue={selectedCamera?.groupId || cameraList[0].groupId} onChange={(e) => setCamHandler(e.target.value)}>
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

export default CameraSelect;