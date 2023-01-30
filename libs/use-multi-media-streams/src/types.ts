import { VideoCodec } from '@millicast/sdk';

export interface ApplyConstraintsOptions {
  audioConstraints?: MediaTrackConstraints;
  videoConstraints?: MediaTrackConstraints;
}

export interface Bitrate {
  name: string;
  value: number;
}

export interface AddStreamOptions extends Omit<CreateStreamOptions, 'bitrate' | 'codec'> {
  bitrate?: number;
  codec?: VideoCodec;
}

export interface CreateStreamOptions {
  audioConstraints?: MediaTrackConstraints;
  bitrate: number;
  camera?: InputDeviceInfo;
  codec: VideoCodec;
  label?: string;
  objectUrl?: string;
  microphone?: InputDeviceInfo;
  type: StreamTypes;
  videoConstraints?: MediaTrackConstraints;
}

export interface HTMLVideoElementWithCaptureStream extends HTMLVideoElement {
  captureStream: (frameRequestRate?: number) => MediaStream;
}

export interface MediaDevices {
  addStream: (options: AddStreamOptions) => Promise<void>;
  applyConstraints: (id: string, options: ApplyConstraintsOptions) => Promise<void>;
  cameraList: InputDeviceInfo[];
  codecList: VideoCodec[];
  initDefaultStream: () => void;
  microphoneList: InputDeviceInfo[];
  removeStream: (id: string) => void;
  reset: () => void;
  streams: StreamsMap;
  toggleAudio: (id: string) => void;
  toggleVideo: (id: string) => void;
  updateStream: (id: string, stream: Partial<Stream>) => void;
}

export interface MediaDevicesLists {
  cameraList: InputDeviceInfo[];
  microphoneList: InputDeviceInfo[];
}

export interface Resolution {
  height: number;
  name?: string;
  width: number;
}

export interface Stream {
  bitrate: number;
  codec: VideoCodec;
  device?: {
    camera: InputDeviceInfo;
    microphone: InputDeviceInfo;
  };
  capabilities?: {
    camera: MediaTrackCapabilities;
    microphone: MediaTrackCapabilities;
  };
  label: string;
  mediaStream: MediaStream;
  resolutions?: Resolution[];
  settings?: {
    camera: MediaTrackSettings;
    microphone: MediaTrackSettings;
  };
  simulcast?: boolean;
  state: {
    muteAudio: boolean;
    displayVideo: boolean;
  };
  type: StreamTypes;
}

export type StreamsAction =
  | {
      id: string;
      stream: Stream;
      type: StreamsActionType.ADD_STREAM;
    }
  | {
      type: StreamsActionType.REMOVE_STREAM;
      id: string;
    }
  | {
      type: StreamsActionType.RESET;
    }
  | {
      type: StreamsActionType.TOGGLE_AUDIO;
      id: string;
    }
  | {
      type: StreamsActionType.TOGGLE_VIDEO;
      id: string;
    }
  | {
      stream: Partial<Stream>;
      type: StreamsActionType.UPDATE_STREAM;
      id: string;
    };

export type StreamsMap = Map<string, Stream>;

export enum StreamsActionType {
  ADD_STREAM = 'ADD_STREAM',
  REMOVE_STREAM = 'REMOVE_STREAM',
  RESET = 'RESET',
  TOGGLE_AUDIO = 'TOGGLE_AUDIO',
  TOGGLE_VIDEO = 'TOGGLE_VIDEO',
  UPDATE_STREAM = 'UPDATE_STREAM',
}

export enum StreamTypes {
  DISPLAY = 'DISPLAY',
  LOCAL = 'LOCAL',
  MEDIA = 'MEDIA',
}

export interface UseMediaDevicesProps {
  filterOutUsedDevices?: boolean;
  handleError?: (error: string) => void;
}
