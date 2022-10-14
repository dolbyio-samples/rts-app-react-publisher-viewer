import { useEffect, useState } from "react";

const useMedia = () => {
    const [cameraList, setCameraList] = useState<InputDeviceInfo[]>([]);
    const [micList, setMicList] = useState<InputDeviceInfo[]>([]);

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({audio:true,video:true})
        .then((stream) => {
            stream.getTracks().forEach(x=>x.stop());
            
        })

        getMediaDevicesList()
        
    }, [])
    
    const getMediaDevicesList = () => {
        navigator.mediaDevices.enumerateDevices()
        .then(devices => {
            devices.forEach(device => {
                device.kind === 'audioinput' && setMicList([...micList, device]);
                device.kind === 'videoinput' && setCameraList([...cameraList, device]);
            })
        })
    }

    return [
        cameraList,
        micList
    ]
}

export default useMedia;