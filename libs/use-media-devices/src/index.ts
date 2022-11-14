import { useEffect, useState } from 'react';

export type Stereo = 2;
export type Mono = 1;
export type AudioChannels = Mono | Stereo;

export type MediaDevices = {
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
  startDisplayCapture: () => void;
  stopDisplayCapture: () => void;
  displayStream?: MediaStream;
  addMediaConstraints: (audioConstraints: MediaTrackConstraints, videoConstraints: MediaTrackConstraints) => void;
  supportedVideoTrackCapabilities?: MediaTrackCapabilities;
  supportedAudioTrackCapabilities?: MediaTrackCapabilities;
};

const useMediaDevices: () => MediaDevices = () => {
  const [cameraList, setCameraList] = useState<InputDeviceInfo[]>([]);
  const [microphoneList, setMicrophoneList] = useState<InputDeviceInfo[]>([]);

  const [cameraId, setCameraId] = useState<string>();
  const [microphoneId, setMicrophoneId] = useState<string>();

  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState<boolean>(true);

  const [mediaStream, setMediaStream] = useState<MediaStream>();
  const [displayStream, setDisplayStream] = useState<MediaStream>();

  const [supportedVideoTrackCapabilities, setSupportedVideoTrackCapabilities] = useState<MediaTrackCapabilities>();
  const [supportedAudioTrackCapabilities, setSupportedAudioTrackCapabilities] = useState<MediaTrackCapabilities>();

  const idealMediaConstraints = {
    video: {
      width: { ideal: 1280 },
      height: { ideal: 720 },
    },
  };

  useEffect(() => {
    const initializeDeviceList = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        if (stream) {
          getMediaDevicesList();
        } else {
          throw `Cannot get user's media stream`;
        }
      } catch (err) {
        console.error(err);
      }
    };
    initializeDeviceList();
  }, []);

  useEffect(() => {
    (microphoneId || cameraId) && loadMediaStream(microphoneId, cameraId);
  }, [cameraId, microphoneId]);

  useEffect(() => {
    if (mediaStream) {
      if (mediaStream.getAudioTracks().length) {
        const track = mediaStream.getAudioTracks()[0];
        track.enabled = isAudioEnabled;
        setSupportedAudioTrackCapabilities(mediaStream.getAudioTracks()[0].getCapabilities());
      }
      if (mediaStream.getVideoTracks().length) {
        const track = mediaStream.getVideoTracks()[0];
        track.enabled = isVideoEnabled;
        setSupportedVideoTrackCapabilities(mediaStream.getVideoTracks()[0].getCapabilities());
      }
    }
  }, [mediaStream]);

  const loadMediaStream = async (microphoneId?: string, cameraId?: string) => {
    const stream = await navigator.mediaDevices.getUserMedia({
      ...idealMediaConstraints,
      audio: {
        deviceId: microphoneId,
      },
      video: {
        deviceId: cameraId,
      },
    });

    setMediaStream(stream);
  };

  const getMediaDevicesList = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();

    const tempMicrophoneList: InputDeviceInfo[] = [];
    const tempCameraList: InputDeviceInfo[] = [];
    await devices.forEach((device) => {
      device.kind === 'audioinput' && isUniqueDevice(tempMicrophoneList, device) && tempMicrophoneList.push(device);
      device.kind === 'videoinput' && isUniqueDevice(tempCameraList, device) && tempCameraList.push(device);
    });

    setCameraList(tempCameraList);
    setMicrophoneList(tempMicrophoneList);

    !cameraId && setCameraId(tempCameraList[0].deviceId);
    !microphoneId && setMicrophoneId(tempMicrophoneList[0].deviceId);
  };

  const isUniqueDevice = (deviceList: InputDeviceInfo[], device: InputDeviceInfo) => {
    return !(device.deviceId.includes('default') || deviceList.some((item) => item.deviceId === device.deviceId));
  };

  const toggleAudio = () => {
    const audioTracks = mediaStream?.getAudioTracks();
    if (audioTracks && audioTracks.length) {
      audioTracks[0].enabled = !isAudioEnabled;
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  const toggleVideo = () => {
    const videoTracks = mediaStream?.getVideoTracks();
    if (videoTracks && videoTracks.length) {
      videoTracks[0].enabled = !isVideoEnabled;
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const startDisplayCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: 'always' },
        audio: true,
      } as DisplayMediaStreamConstraints);
      if (stream) {
        if (!stream.getVideoTracks().length) throw 'No video steram for sharing';
        setDisplayStream(stream);
        stream.getVideoTracks()[0].addEventListener('ended', () => {
          setDisplayStream(undefined);
        });
      }
    } catch (error) {
      console.log('failed to get display stream', error);
    }
  };

  const stopDisplayCapture = () => {
    if (!displayStream) return;
    displayStream.getTracks().forEach((track) => track.stop());
    setDisplayStream(undefined);
  };

  const addMediaConstraints = async (
    audioConstraints: MediaTrackConstraints,
    videoConstraints: MediaTrackConstraints
  ) => {
    if (mediaStream) {
      const tracks = mediaStream.getTracks();
      tracks.forEach((track) => {
        track.stop();
      });

      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          audio: audioConstraints,
          video: videoConstraints,
        });
        setMediaStream(newStream);
      } catch (error) {
        console.error('Issue(s) occured when applying new constraints: ', error);
      }
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
    startDisplayCapture,
    stopDisplayCapture,
    displayStream,
    addMediaConstraints,
    supportedVideoTrackCapabilities,
    supportedAudioTrackCapabilities,
  };
};

export default useMediaDevices;
