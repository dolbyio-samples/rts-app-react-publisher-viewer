import { useEffect, useState } from "react";

type MediaDevices = {
    cameraList: InputDeviceInfo[];
    microphoneList: InputDeviceInfo[];
    setCameraId: (deviceId: string) => void;
    setMicrophoneId: (deviceId: string) => void;
    cameraId?: string;
    microphoneId?: string;
    mediaStream?: MediaStream;
}

const useMediaDevices: () => MediaDevices = () => {
    const [cameraList, setCameraList] = useState<InputDeviceInfo[]>([]);
    const [microphoneList, setMicrophoneList] = useState<InputDeviceInfo[]>([]);
    
    const [cameraId, setCameraId] = useState<string>();
    const [microphoneId, setMicrophoneId] = useState<string>();

    const [mediaStream, setMediaStream] = useState<MediaStream>();

    useEffect(() => {
         const getInitDevicesPermisson = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: true
                    })
                if (stream) {
                    getMediaDevicesList();
                }
            } catch (err) {
                console.log('Camera or microphone permission denied.')
            }
        }
        getInitDevicesPermisson() 
    }, [])

    useEffect(() => {
        microphoneId && cameraId && loadMediaStream(microphoneId, cameraId)
    }, [cameraId, microphoneId])

    const loadMediaStream = async (microphoneId: string, cameraId: string) => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
                deviceId: microphoneId
            },
            video: {
                deviceId: cameraId
            }
        })

        stream.getTracks()
        setMediaStream(stream)    
    }
    
    const getMediaDevicesList = async () => {
        const devices = await navigator.mediaDevices.enumerateDevices()
        
        const tempMicrophoneList: InputDeviceInfo[] = [];
        const tempCameraList: InputDeviceInfo[] = [];
        await devices.forEach(device => {
            device.kind === 'audioinput' && isUniqueDevice(tempMicrophoneList, device) && tempMicrophoneList.push(device);
            device.kind === 'videoinput' && isUniqueDevice(tempCameraList, device) && tempCameraList.push(device);
        })

        if (!cameraList.length) {
            setCameraList(tempCameraList);            
        }

        if (!microphoneList.length) {
            setMicrophoneList(tempMicrophoneList);            
        }
        
        !cameraId && setCameraId(tempCameraList[0].deviceId);
        !microphoneId && setMicrophoneId(tempMicrophoneList[0].deviceId);    
    }

    const isUniqueDevice = (deviceList: InputDeviceInfo[], device: InputDeviceInfo) => {
        return !(device.deviceId.includes('default') ||  deviceList.some(item => item.deviceId === device.deviceId))
            return false;
        } else if (deviceList.some(item => item.deviceId === device.deviceId)) {
            return false;
        }

        return true;
    }

    const setSelectedCamera = (deviceId: string) => {
        setCameraId(deviceId);
    }

    const setSelectedMicrophone = (deviceId: string) => {
        setMicrophoneId(deviceId);
    }

    return {
        cameraList,
        microphoneList,
        setCameraId: setSelectedCamera,
        setMicrophoneId: setSelectedMicrophone,
        cameraId,
        microphoneId,
        mediaStream
    }
}

export default useMediaDevices;