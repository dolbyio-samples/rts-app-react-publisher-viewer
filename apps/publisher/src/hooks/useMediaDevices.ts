import { useEffect, useState } from "react";

type MediaDevices = {
    cameraList: InputDeviceInfo[];
    microphoneList: InputDeviceInfo[];
    setCamera: (device: InputDeviceInfo) => void;
    setMicrophone: (device: InputDeviceInfo) => void;
    camera?: InputDeviceInfo;
    microphone?: InputDeviceInfo;
    mediaStream?: MediaStream;
}

const useMediaDevices: () => MediaDevices = () => {
    const [cameraList, setCameraList] = useState<InputDeviceInfo[]>([]);
    const [microphoneList, setMicrophoneList] = useState<InputDeviceInfo[]>([]);
    
    const [camera, setCamera] = useState<InputDeviceInfo>();
    const [microphone, setMicrophone] = useState<InputDeviceInfo>();

    const [mediaStream, setMediaStream] = useState<MediaStream | undefined>();

    useEffect(() => {
        getMediaDevicesList();
    }, [])

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({
            audio: {
                deviceId: microphone?.deviceId
            },
            video: {
                deviceId: camera?.deviceId
            }
        })
        .then((stream) => {
            stream.getTracks()
            setMediaStream(stream)
        })
    }, [camera?.deviceId, microphone?.deviceId])
    
    const getMediaDevicesList = async () => {
        const devices = await navigator.mediaDevices.enumerateDevices()
        
        const tempMicrophoneList: InputDeviceInfo[] = [];
        const tempCameraList: InputDeviceInfo[] = [];
        devices.forEach(device => {
            device.kind === 'audioinput' && !tempMicrophoneList.some(item => item.groupId === device.groupId) && tempMicrophoneList.push(device);
            device.kind === 'videoinput' && !tempCameraList.some(item => item.groupId === device.groupId) && tempCameraList.push(device);
        })
        setMicrophoneList(tempMicrophoneList);
        setCameraList(tempCameraList);
    
        cameraList.length && setCamera(cameraList[0]);
        microphoneList.length && setMicrophone(microphoneList[0]);    
    }

    const setSelectedCamera = (device: InputDeviceInfo) => {
        setCamera(device);
    }

    const setSelectedMicrophone = (device: InputDeviceInfo) => {
        setMicrophone(device);
    }

    return {
        cameraList,
        microphoneList,
        setCamera: setSelectedCamera,
        setMicrophone: setSelectedMicrophone,
        camera,
        microphone,
        mediaStream
    }
}

export default useMediaDevices;