import React, { memo } from 'react';
import { Select } from "@chakra-ui/react";

type MicrophoneSelectProps = {
    microphoneList: InputDeviceInfo[];
    onSelectMicrophoneId: (deviceId: string) => void;
    selectedMicrophoneId?: string;
}

const MicrophoneSelect = ({microphoneList, onSelectMicrophoneId: setMicrophoneId, selectedMicrophoneId}: MicrophoneSelectProps) => {
    return (
        <Select test-id="microphoneSelect" placeholder="Select Microphone" defaultValue={selectedMicrophoneId || microphoneList[0].deviceId} onChange={(e) => setMicrophoneId(e.target.value)} >
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