import { useEffect, useState } from "react";

type MediaDevices = {
    cameraList: InputDeviceInfo[];
    microphoneList: InputDeviceInfo[];
    setCameraHandler: (device: InputDeviceInfo) => void;
    setMicrophoneHandler: (device: InputDeviceInfo) => void;
    selectedCamera?: InputDeviceInfo;
    selectedMicrophone?: InputDeviceInfo;
    mediaStream: MediaStream | undefined;
}

const useMediaDevices: () => MediaDevices = () => {
    const [cameraList, setCameraList] = useState<InputDeviceInfo[]>([]);
    const [microphoneList, setMicrophoneList] = useState<InputDeviceInfo[]>([]);
    
    const [selectedCamera, setCamera] = useState<InputDeviceInfo>();
    const [selectedMicrophone, setMicrophone] = useState<InputDeviceInfo>();

    const [mediaStream, setMediaStream] = useState<MediaStream | undefined>();

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({audio:true,video:true})
        .then((stream) => {
            stream.getTracks()
            setMediaStream(stream)
        })

        getMediaDevicesList();
    }, [selectedCamera, selectedMicrophone])
    
    const getMediaDevicesList = () => {
        navigator.mediaDevices.enumerateDevices()
        .then(devices => {
            const tempMicrophoneList: InputDeviceInfo[] = [];
            const tempCameraList: InputDeviceInfo[] = [];
            devices.forEach(device => {
                device.kind === 'audioinput' && addUniqueDevice(tempMicrophoneList, device);
                device.kind === 'videoinput' && addUniqueDevice(tempCameraList, device);
            })
            setMicrophoneList(tempMicrophoneList);
            setCameraList(tempCameraList);
        })
        .then(() => {
            setCamera(cameraList[0]);
            setMicrophone(microphoneList[0]);
        })
    }

    const addUniqueDevice = (deviceList: InputDeviceInfo[], device: InputDeviceInfo) => {
        if (deviceList.some(item => item.groupId !== device.groupId)) {
            deviceList.push(device);
        }
    }

    const setCameraHandler = (device: InputDeviceInfo) => {
        setCamera(device);
    }

    const setMicrophoneHandler = (device: InputDeviceInfo) => {
        setMicrophone(device);
    }

    return {
        cameraList,
        microphoneList,
        setCameraHandler,
        setMicrophoneHandler,
        selectedCamera,
        selectedMicrophone,
        mediaStream
    }
}

export default useMediaDevices;