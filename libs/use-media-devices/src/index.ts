import { useEffect, useState } from 'react';
import { Resolution } from '../../resolution-select/src';

declare global {
  // Added missing type of 'channelCount' to the 'MediaTrackSupportedConstraints'
  interface MediaTrackSettings {
    channelCount: number;
  }
}
export type Stereo = 2;
export type Mono = 1;
export type AudioChannels = Mono | Stereo;

export type MediaConstraints = {
  resolution?: Resolution;
  echoCancellation?: boolean;
  channelCount?: AudioChannels;
};

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
  updateMediaConstraints: (constraints: MediaConstraints) => void;
  isChannelCountSupported: boolean;
  isEchoCancellationSupported: boolean;
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

  const [isChannelCountSupported, setIsChannelCountSupported] = useState<boolean>(false);
  const [isEchoCancellationSupported, setIsEchoCancellationSupported] = useState<boolean>(false);

  const mediaConstraints = {
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

        // check if the audio device supports channelCount and echo cancellation
        const capabilities = track.getCapabilities();
        if (capabilities.echoCancellation && capabilities.echoCancellation.includes(true)) {
          setIsEchoCancellationSupported(true);
        }
        if (capabilities.channelCount?.max && capabilities.channelCount.max >= 2) {
          setIsChannelCountSupported(true);
        }
      }
      if (mediaStream.getVideoTracks().length) {
        const track = mediaStream.getVideoTracks()[0];
        track.enabled = isVideoEnabled;
      }
    }
  }, [mediaStream]);

  const loadMediaStream = async (microphoneId?: string, cameraId?: string) => {
    const stream = await navigator.mediaDevices.getUserMedia({
      ...mediaConstraints,
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

  const applyNewConstraints = async (
    audioConstraints: MediaTrackConstraints,
    videoConstraints: MediaTrackConstraints
  ) => {
    if (mediaStream) {
      const tracks = mediaStream.getTracks();
      tracks.forEach((track) => {
        track.stop();
      });

      try {
        const new_stream = await navigator.mediaDevices.getUserMedia({
          audio: audioConstraints,
          video: videoConstraints,
        });

        const newAudioStreamSettings = new_stream.getAudioTracks()[0].getSettings();
        const newVideoStreamSettings = new_stream.getVideoTracks()[0].getSettings();

        if (
          videoConstraints.width !== undefined && 
          videoConstraints.height !== undefined &&
          (newVideoStreamSettings.width !== videoConstraints.width ||
          newVideoStreamSettings.height !== videoConstraints.height)
        ) {
          throw "The selected resolution couldn't be applied.";
        }
        if (audioConstraints.echoCancellation !== undefined && newAudioStreamSettings.echoCancellation !== audioConstraints.echoCancellation) {
          throw "The selected echoCancellation couldn't be applied.";
        }
        if (audioConstraints.channelCount !== undefined && newAudioStreamSettings.channelCount !== audioConstraints.channelCount) {
          throw "The selected channelCount couldn't be applied.";
        }

        setMediaStream(new_stream);
      } catch (error) {
        console.error('Issue(s) occured when applying new constraints: ', error);
      }
    }
  };

  const updateMediaConstraints = ({ resolution, echoCancellation, channelCount }: MediaConstraints) => {
    if (mediaStream) {
      const videoTracks = mediaStream.getVideoTracks();
      const audioTracks = mediaStream.getAudioTracks();
      const audioConstraints = audioTracks[0].getConstraints();
      const videoConstraints = videoTracks[0].getConstraints();

      if (videoTracks.length && resolution) {
        videoConstraints.width = resolution.width ;
        videoConstraints.height = resolution.height;
      }

      if (audioTracks.length) {
        if (echoCancellation !== undefined) {
          audioConstraints.echoCancellation = echoCancellation;
        }
        if (channelCount !== undefined) {
          audioConstraints.channelCount = channelCount;
        }
      }

      applyNewConstraints(audioConstraints, videoConstraints);
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
    updateMediaConstraints,
    isChannelCountSupported,
    isEchoCancellationSupported,
  };
};

export default useMediaDevices;
