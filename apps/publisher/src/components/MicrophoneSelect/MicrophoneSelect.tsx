import React, { memo } from 'react';
import { Select } from "@chakra-ui/react";

type MicrophoneSelectProps = {
    microphoneList: InputDeviceInfo[];
    setMicrophone: (deviceId: string) => void;
    selectedMicrophone?: string;
}

const MicrophoneSelect = ({microphoneList, setMicrophone, selectedMicrophone}: MicrophoneSelectProps) => {
    return (
        <Select test-id="microphoneSelect" placeholder="Select Microphone" defaultValue={selectedMicrophone || microphoneList[0].deviceId} onChange={(e) => setMicrophone(e.target.value)} >
            {microphoneList.map(microphone => {
                return (
                    <option 
                        value={microphone.deviceId} 
                        key={microphone.deviceId}
                    >
                        {microphone.label}
                    </option>
                )})}
        </Select>
    )
}

export default memo(MicrophoneSelect);