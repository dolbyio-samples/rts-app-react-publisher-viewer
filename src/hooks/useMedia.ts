import { useEffect, useState } from "react";

type UseMediaType = {
    cameraList: InputDeviceInfo[];
    micList: InputDeviceInfo[];
    setCamera: React.Dispatch<React.SetStateAction<InputDeviceInfo | undefined>>;
    setMic: React.Dispatch<React.SetStateAction<InputDeviceInfo | undefined>>;
    selectedCamera: InputDeviceInfo | undefined;
    selectedMic: InputDeviceInfo | undefined;
    mediaStream: MediaStream | null;
}

const useMedia: () => UseMediaType = () => {
    const [cameraList, setCameraList] = useState<InputDeviceInfo[]>([]);
    const [micList, setMicList] = useState<InputDeviceInfo[]>([]);
    
    const [selectedCamera, setCamera] = useState<InputDeviceInfo>();
    const [selectedMic, setMic] = useState<InputDeviceInfo>();

    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

    useEffect(() => {
        getMediaDevicesList();
        
        navigator.mediaDevices.getUserMedia({audio:true,video:true})
        .then((stream) => {
            stream.getTracks()
            setMediaStream(stream)
        })
    }, [selectedCamera, selectedMic])
    
    const getMediaDevicesList = () => {
        navigator.mediaDevices.enumerateDevices()
        .then(devices => {
            devices.forEach(device => {
                device.kind === 'audioinput' && setMicList((currentList) => addUniqueDevice(currentList, device));
                device.kind === 'videoinput' && setCameraList((currentList) => addUniqueDevice(currentList, device));
            })
        })
        .then(() => {
            setCamera(cameraList[0]);
            setMic(micList[0]);
        })
    }

    const addUniqueDevice = (deviceList: InputDeviceInfo[], device: InputDeviceInfo) => {
        if (deviceList.some(item => item.groupId === device.groupId)) {
            return deviceList;
        }
        return [...deviceList, device];
    }

    return {
        cameraList,
        micList,
        setCamera,
        setMic,
        selectedCamera,
        selectedMic,
        mediaStream
    }
}

export default useMedia;