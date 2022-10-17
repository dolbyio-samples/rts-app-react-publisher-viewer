import React from 'react';
import { Select } from "@chakra-ui/react";

type MicSelectType = {
    micList: InputDeviceInfo[];
    setMicHandler: (groupId: string) => void;
    selectedMic?: InputDeviceInfo;
}

const MicSelect = ({micList, setMicHandler, selectedMic}: MicSelectType) => {
    return (
        <Select placeholder="Select Microphone" defaultValue={selectedMic?.groupId || micList[0].groupId} onChange={(e) => setMicHandler(e.target.value)} >
            {micList.map(mic => {
                return (
                    <option 
                        value={mic.groupId} 
                        key={mic.groupId}
                    >
                        {mic.label}
                    </option>
                )})}
        </Select>
    )
}

export default MicSelect;