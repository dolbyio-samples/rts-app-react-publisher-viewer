import { useEffect, useState } from "react";
import { Resolution } from "../components/ResolutionSelect/ResolutionSelect";


export type AudioChannels = 1 | 2;

export type MediaConstraints = {
    resolution: Resolution;
    echoCancellation: boolean;
    channelCount: AudioChannels;
};

const DEFAULT_ASPECT_RATIO = (16 / 9);

type MediaDevices = {
    cameraList: InputDeviceInfo[];
    microphoneList: InputDeviceInfo[];
    setCameraId: (deviceId: string) => void;
    setMicrophoneId: (deviceId: string) => void;
    cameraId?: string;
    microphoneId?: string;
    isAudioEnabled: boolean;
    isVideoEnabled: boolean;
    toggleAudio: () => void;
    toggleVideo: () => void;
    mediaStream?: MediaStream;
    updateMediaConstraints: (constraints: MediaConstraints) => void;
}

const useMediaDevices: () => MediaDevices = () => {
    const [cameraList, setCameraList] = useState<InputDeviceInfo[]>([]);
    const [microphoneList, setMicrophoneList] = useState<InputDeviceInfo[]>([]);
    
    const [cameraId, setCameraId] = useState<string>();
    const [microphoneId, setMicrophoneId] = useState<string>();

    const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(true);
    const [isVideoEnabled, setIsVideoEnabled] = useState<boolean>(true);

    const [mediaStream, setMediaStream] = useState<MediaStream>();

    useEffect(() => {
         const initializeDeviceList = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: true
                    })
                if (stream) {
                    getMediaDevicesList();
                } else {
                    throw `Cannot get user's media stream`;
                }
            } catch (err) {
                console.error(err);
            }
        }
        initializeDeviceList();
    }, [])

    useEffect(() => {
        (microphoneId || cameraId) && loadMediaStream(microphoneId, cameraId)
    }, [cameraId, microphoneId])

    useEffect(() => {
        if (mediaStream) {
            if (mediaStream.getAudioTracks().length) {
                const track = mediaStream.getAudioTracks()[0];
                track.enabled = isAudioEnabled;
            }
            if (mediaStream.getVideoTracks().length) {
                const track = mediaStream.getVideoTracks()[0];
                track.enabled = isVideoEnabled;
            }
        }
    }, [mediaStream]);

    const loadMediaStream = async (microphoneId?: string, cameraId?: string) => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
                deviceId: microphoneId
            },
            video: {
                deviceId: cameraId
            }
        });

        setMediaStream(stream);
    }
    
    const getMediaDevicesList = async () => {
        const devices = await navigator.mediaDevices.enumerateDevices()
        
        const tempMicrophoneList: InputDeviceInfo[] = [];
        const tempCameraList: InputDeviceInfo[] = [];
        await devices.forEach(device => {
            device.kind === 'audioinput' && isUniqueDevice(tempMicrophoneList, device) && tempMicrophoneList.push(device);
            device.kind === 'videoinput' && isUniqueDevice(tempCameraList, device) && tempCameraList.push(device);
        })

        setCameraList(tempCameraList);            
        setMicrophoneList(tempMicrophoneList);            
        
        !cameraId && setCameraId(tempCameraList[0].deviceId);
        !microphoneId && setMicrophoneId(tempMicrophoneList[0].deviceId);    
    }

    const isUniqueDevice = (deviceList: InputDeviceInfo[], device: InputDeviceInfo) => {
        return !(device.deviceId.includes('default') ||  deviceList.some(item => item.deviceId === device.deviceId))
    }

    const toggleAudio = () => {
        const audioTracks = mediaStream?.getAudioTracks();
        if (audioTracks && audioTracks.length) {
            audioTracks[0].enabled = !isAudioEnabled;
            setIsAudioEnabled(!isAudioEnabled);
        }
    }

    const toggleVideo = () => {
        const videoTracks = mediaStream?.getVideoTracks();
        if (videoTracks && videoTracks.length) {
            videoTracks[0].enabled = !isVideoEnabled;
            setIsVideoEnabled(!isVideoEnabled);
        }
    }

    const updateMediaConstraints = ({ resolution, echoCancellation, channelCount }: MediaConstraints) => {
        const videoTracks = mediaStream?.getVideoTracks();
        if (videoTracks && videoTracks.length) {
            videoTracks[0].applyConstraints({
                width: { min: 640, max: 1920 },
                height: { min: 360, max: 1080 },
                advanced: [
                    {
                        width: resolution.width,
                        height: resolution.height
                    },
                    { aspectRatio: DEFAULT_ASPECT_RATIO }
                ]
            });
        }

        const audioTracks = mediaStream?.getAudioTracks();
        if (audioTracks && audioTracks.length) {
            audioTracks[0].applyConstraints(
                {
                    echoCancellation,
                    channelCount
                }
            );
        }
    };

    return {
        cameraList,
        microphoneList,
        setCameraId,
        setMicrophoneId,
        cameraId,
        microphoneId,
        isAudioEnabled,
        isVideoEnabled,
        toggleAudio,
        toggleVideo,
        mediaStream,
        updateMediaConstraints
    }
}

export default useMediaDevices;