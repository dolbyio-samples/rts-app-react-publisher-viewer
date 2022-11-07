import { useEffect, useState } from 'react';
import { Resolution } from '../../resolution-select/src';

export type AudioChannels = 1 | 2;

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
  supportedResolutions: Resolution[];
  isSupportChannelCount: boolean;
  isSupportEchoCancellation: boolean;
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

  const [supportedResolutions, setSupportedResolutions] = useState<Resolution[]>([]);
  const [isSupportChannelCount, setIsSupportChannelCount] = useState<boolean>(false);
  const [isSupportEchoCancellation, setIsSupportEchoCancellation] = useState<boolean>(false);

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

        // check if the audio device supports codec, channelCount and echo cancellation
        const supportedConstraints = navigator.mediaDevices.getSupportedConstraints();
        if (supportedConstraints.echoCancellation) {
          setIsSupportEchoCancellation(true);
        }
        // TODO: resolve error of 'Property 'channelCount' does not exist on type 'MediaTrackSupportedConstraints'.'
        if (supportedConstraints.channelCount) {
          setIsSupportChannelCount(true);
        }
      }
      if (mediaStream.getVideoTracks().length) {
        const track = mediaStream.getVideoTracks()[0];
        track.enabled = isVideoEnabled;

        // List supported camera resolutions
        const capabilities = track.getCapabilities();
        const tempSupportedResolutionList = [];
        if (capabilities.width && capabilities.width.max) {
          if (capabilities.width.max >= 3840) {
            tempSupportedResolutionList.push({
              name: '2160p',
              width: 3840,
              height: 2160,
            });
          }
          if (capabilities.width.max >= 2560) {
            tempSupportedResolutionList.push({
              name: '1440p',
              width: 2560,
              height: 1440,
            });
          }
          if (capabilities.width.max >= 1920) {
            tempSupportedResolutionList.push({
              name: '1080p',
              width: 1920,
              height: 1080,
            });
          }
          if (capabilities.width.max >= 1280) {
            tempSupportedResolutionList.push({
              name: '720p',
              width: 1280,
              height: 720,
            });
          }
          if (capabilities.width.max >= 720) {
            tempSupportedResolutionList.push({
              name: '480p',
              width: 720,
              height: 480,
            });
          }
        }
        if (tempSupportedResolutionList.length !== 0) {
          setSupportedResolutions(tempSupportedResolutionList);
        }
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

  const updateMediaConstraints = ({ resolution, echoCancellation, channelCount }: MediaConstraints) => {
    const videoTracks = mediaStream?.getVideoTracks();
    if (videoTracks && videoTracks.length && resolution) {
      try {
        videoTracks[0]
          .applyConstraints({
            width: { ideal: resolution.width },
            height: { ideal: resolution.height },
          })
          .then(() => {
            if (
              videoTracks[0].getConstraints().width !== resolution.width ||
              videoTracks[0].getConstraints().height !== resolution.height
            ) {
              throw "The selected resolution couldn't be applied.";
            }
          });
      } catch (err) {
        console.log('Issue(s) occured when applying new constraints: ', err);
      }
    }

    const audioTracks = mediaStream?.getAudioTracks();
    if (audioTracks && audioTracks.length && (echoCancellation || channelCount)) {
      try {
        audioTracks[0]
          .applyConstraints({
            echoCancellation,
            channelCount,
          })
          .then(() => {
            if (echoCancellation && audioTracks[0].getConstraints().echoCancellation !== echoCancellation) {
              throw "The selected echoCancellation couldn't be applied.";
            }
            if (channelCount && audioTracks[0].getConstraints().channelCount !== channelCount) {
              throw "The selected channelCount couldn't be applied.";
            }
          });
      } catch (err) {
        console.log('Issue(s) occured when applying new constraints: ', err);
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
    updateMediaConstraints,
    supportedResolutions,
    isSupportChannelCount,
    isSupportEchoCancellation,
  };
};

export default useMediaDevices;
