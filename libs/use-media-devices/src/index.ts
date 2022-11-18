import { useEffect, useMemo } from 'react';
import useState from 'react-usestateref';

export type MediaDevices = {
  cameraList: InputDeviceInfo[];
  microphoneList: InputDeviceInfo[];
  setCamera: (device: InputDeviceInfo) => void;
  setMicrophone: (device: InputDeviceInfo) => void;
  camera?: InputDeviceInfo;
  microphone?: InputDeviceInfo;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  toggleAudio: () => void;
  toggleVideo: () => void;
  mediaStream?: MediaStream;
  startDisplayCapture: () => void;
  stopDisplayCapture: () => void;
  displayStream?: MediaStream;
  applyMediaTrackConstraints: (
    audioConstraints: MediaTrackConstraints,
    videoConstraints: MediaTrackConstraints
  ) => void;
  // Supported capabilites of selected camera and microphone
  cameraCapabilities?: MediaTrackCapabilities;
  microphoneCapabilities?: MediaTrackCapabilities;
  // Current settings of selected camera and microphone
  cameraSettings?: MediaTrackSettings;
  microphoneSettings?: MediaTrackSettings;
};

type MediaDevicesLists = { cameraList: InputDeviceInfo[]; microphoneList: InputDeviceInfo[] };

const ideaCameraConfig = { width: { ideal: 7680 }, height: { ideal: 4320 }, aspectRatio: 7680 / 4320 };

const useMediaDevices: () => MediaDevices = () => {
  const [cameraList, setCameraList] = useState<InputDeviceInfo[]>([]);
  const [microphoneList, setMicrophoneList] = useState<InputDeviceInfo[]>([]);

  const [camera, setCamera] = useState<InputDeviceInfo>();
  const [microphone, setMicrophone] = useState<InputDeviceInfo>();

  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState<boolean>(true);

  const [mediaStream, setMediaStream, mediaStreamRef] = useState<MediaStream>();
  const [displayStream, setDisplayStream, displayStreamRef] = useState<MediaStream>();

  useEffect(() => {
    const initializeDeviceList = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: ideaCameraConfig,
      });
      if (stream) {
        const { cameraList, microphoneList } = await getMediaDevicesLists();
        setCamera(cameraList[0]);
        setMicrophone(microphoneList[0]);
      } else {
        throw `Cannot get user's media stream`;
      }
    };
    initializeDeviceList();
  }, []);

  useEffect(() => {
    if (microphone && camera) {
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
      loadMediaStream(microphone.deviceId, camera.deviceId);
    }
  }, [camera, microphone]);

  const { microphoneCapabilities, cameraCapabilities } = useMemo(() => {
    const microphoneCapabilities = mediaStream?.getAudioTracks()[0].getCapabilities();
    const cameraCapabilities = mediaStream?.getVideoTracks()[0].getCapabilities();
    return { microphoneCapabilities, cameraCapabilities };
  }, [mediaStream]);

  const { microphoneSettings, cameraSettings } = useMemo(() => {
    const microphoneSettings = mediaStream?.getAudioTracks()[0].getSettings();
    const cameraSettings = mediaStream?.getVideoTracks()[0].getSettings();
    return { microphoneSettings, cameraSettings };
  }, [mediaStream]);

  const loadMediaStream = async (microphoneId: string, cameraId: string) => {
    const constraints = {
      audio: {
        deviceId: { exact: microphoneId },
      },
      video: {
        deviceId: { exact: cameraId },
        ...ideaCameraConfig,
      },
    };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    setMediaStream(stream);
  };

  const getMediaDevicesLists = async (): Promise<MediaDevicesLists> => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const microphoneList: InputDeviceInfo[] = [];
    const cameraList: InputDeviceInfo[] = [];
    devices.forEach((device) => {
      if (device.kind === 'audioinput' && isUniqueDevice(microphoneList, device)) microphoneList.push(device);
      else if (device.kind === 'videoinput' && isUniqueDevice(cameraList, device)) cameraList.push(device);
    });
    setCameraList(cameraList);
    setMicrophoneList(microphoneList);
    return Promise.resolve({ cameraList, microphoneList });
  };

  const isUniqueDevice = (deviceList: InputDeviceInfo[], device: InputDeviceInfo) => {
    return !(device.deviceId === 'default' || deviceList.some((item) => item.deviceId === device.deviceId));
  };

  const toggleAudio = () => {
    const audioTracks = mediaStreamRef.current?.getAudioTracks();
    if (audioTracks && audioTracks.length) {
      audioTracks[0].enabled = !isAudioEnabled;
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  const toggleVideo = () => {
    const videoTracks = mediaStreamRef.current?.getVideoTracks();
    if (videoTracks && videoTracks.length) {
      videoTracks[0].enabled = !isVideoEnabled;
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const startDisplayCapture = async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: { cursor: 'always' },
      audio: true,
    } as DisplayMediaStreamConstraints);
    if (stream) {
      if (!stream.getVideoTracks().length) throw 'No video stream for sharing';
      setDisplayStream(stream);
      stream.getVideoTracks()[0].addEventListener('ended', () => {
        setDisplayStream(undefined);
      });
    }
  };

  const stopDisplayCapture = () => {
    if (!displayStreamRef.current) return;
    displayStreamRef.current.getTracks().forEach((track) => track.stop());
    setDisplayStream(undefined);
  };

  const applyMediaTrackConstraints = async (
    audioConstraints: MediaTrackConstraints,
    videoConstraints: MediaTrackConstraints
  ) => {
    // Chrome requires to create a new media stream if audio constraints are changed
    // [See this](https://bugs.chromium.org/p/chromium/issues/detail?id=796964)
    mediaStreamRef.current?.getTracks().forEach((track) => {
      track.stop();
    });
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        audio: audioConstraints,
        video: videoConstraints,
      });
      setMediaStream(newStream);
    } catch (err) {
      console.error('Cannot apply constraints:', videoConstraints, 'error is:', err);
      const newStream = await navigator.mediaDevices.getUserMedia({
        audio: audioConstraints,
        video: {
          ...videoConstraints,
          width: { ideal: videoConstraints.width as number },
          height: { ideal: videoConstraints.height as number },
        },
      });
      setMediaStream(newStream);
    }
  };

  return {
    cameraList,
    microphoneList,
    camera,
    setCamera,
    microphone,
    setMicrophone,
    isAudioEnabled,
    isVideoEnabled,
    toggleAudio,
    toggleVideo,
    mediaStream,
    startDisplayCapture,
    stopDisplayCapture,
    displayStream,
    applyMediaTrackConstraints,
    cameraCapabilities,
    microphoneCapabilities,
    cameraSettings,
    microphoneSettings,
  };
};

export default useMediaDevices;
