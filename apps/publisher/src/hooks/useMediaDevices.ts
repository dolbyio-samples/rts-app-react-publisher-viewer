import { useEffect, useState } from "react";

type MediaDevices = {
    cameraList: InputDeviceInfo[];
    microphoneList: InputDeviceInfo[];
    setCamera: (device: string) => void;
    setMicrophone: (device: string) => void;
    camera?: string;
    microphone?: string;
    mediaStream?: MediaStream;
}

const useMediaDevices: () => MediaDevices = () => {
    const [cameraList, setCameraList] = useState<InputDeviceInfo[]>([]);
    const [microphoneList, setMicrophoneList] = useState<InputDeviceInfo[]>([]);
    
    const [camera, setCamera] = useState<string>();
    const [microphone, setMicrophone] = useState<string>();

    const [mediaStream, setMediaStream] = useState<MediaStream | undefined>();

    useEffect(() => {
        loadMediaStream()
    }, [camera, microphone])

    const loadMediaStream = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
                deviceId: microphone
            },
            video: {
                deviceId: camera
            }
        })

        stream.getTracks()
        setMediaStream(stream)      

        const cameraDevicesPermission = await navigator.permissions.query({name: 'camera' as PermissionName})
        const microphoneDevicesPermission = await navigator.permissions.query({name: 'microphone' as PermissionName})

        if(cameraDevicesPermission.state === 'granted' && microphoneDevicesPermission.state === 'granted') {
            getMediaDevicesList()
        }
    }
    
    const getMediaDevicesList = async () => {
        const devices = await navigator.mediaDevices.enumerateDevices()
        
        const tempMicrophoneList: InputDeviceInfo[] = [];
        const tempCameraList: InputDeviceInfo[] = [];
        await devices.forEach(device => {
            device.kind === 'audioinput' && isUniqueDevice(tempMicrophoneList, device) && tempMicrophoneList.push(device);
            device.kind === 'videoinput' && isUniqueDevice(tempCameraList, device) && tempCameraList.push(device);
        })

        console.log(cameraList.length)
        if (!cameraList.length) {
            setCameraList(tempCameraList);
            console.log('cameraList')
            
        }

        console.log(microphoneList.length)
        if (!microphoneList.length) {
            setMicrophoneList(tempMicrophoneList);
            console.log('micList')
            
        }
        
        !camera && setCamera(tempCameraList[0].deviceId);
        !microphone && setMicrophone(tempMicrophoneList[0].deviceId); 
        console.log('fetched')
   
    }

    const isUniqueDevice = (deviceList: InputDeviceInfo[], device: InputDeviceInfo) => {
        if (device.deviceId.includes('default')) {
            return false;
        } else if (deviceList.some(item => item.deviceId === device.deviceId)) {
            return false;
        }

        return true;
    }

    const setSelectedCamera = (device: string) => {
        setCamera(device);
    }

    const setSelectedMicrophone = (device: string) => {
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