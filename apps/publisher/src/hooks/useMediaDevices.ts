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
        getMediaDevicesList();
    }, [])

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({
            audio: {
                deviceId: selectedMicrophone?.deviceId
            },
            video: {
                deviceId: selectedCamera?.deviceId
            }
        })
        .then((stream) => {
            stream.getTracks()
            setMediaStream(stream)
        })
    }, [selectedCamera?.deviceId, selectedMicrophone?.deviceId])
    
    const getMediaDevicesList = () => {
        navigator.mediaDevices.enumerateDevices()
        .then(devices => {
            const tempMicrophoneList: InputDeviceInfo[] = [];
            const tempCameraList: InputDeviceInfo[] = [];
            devices.forEach(device => {
                device.kind === 'audioinput' && isNewDevice(tempMicrophoneList, device) && tempMicrophoneList.push(device);
                device.kind === 'videoinput' && isNewDevice(tempCameraList, device) && tempCameraList.push(device);
            })
            setMicrophoneList(tempMicrophoneList);
            setCameraList(tempCameraList);
        })
        .then(() => {
            setCamera(cameraList[0]);
            setMicrophone(microphoneList[0]);
        })
    }

    const isNewDevice = (deviceList: InputDeviceInfo[], device: InputDeviceInfo) => {
        if (deviceList.some(item => item.groupId === device.groupId)) {
            return false;
        }
        return true
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