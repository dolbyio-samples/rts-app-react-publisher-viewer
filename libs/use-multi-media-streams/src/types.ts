import { LocalFile } from '@millicast-react/use-local-file';

export interface ApplyConstraintsOptions {
  audioConstraints?: MediaTrackConstraints;
  id: StreamId;
  videoConstraints?: MediaTrackConstraints;
}

export interface CreateStreamOptions {
  audioConstraints?: MediaTrackConstraints;
  camera?: InputDeviceInfo;
  localFile?: LocalFile;
  microphone?: InputDeviceInfo;
  type: StreamTypes;
  videoConstraints?: MediaTrackConstraints;
}

export interface HTMLVideoElementWithCaptureStream extends HTMLVideoElement {
  captureStream: (frameRequestRate?: number) => MediaStream;
}

export interface MediaDevices {
  addStream: (options: CreateStreamOptions) => Promise<void>;
  applyConstraints: (options: ApplyConstraintsOptions) => Promise<void>;
  cameraList: InputDeviceInfo[];
  initDefaultStream: () => void;
  microphoneList: InputDeviceInfo[];
  removeStream: (id: StreamId) => void;
  reset: () => void;
  streams: StreamsMap;
  toggleAudio: (id: StreamId) => void;
  toggleVideo: (id: StreamId) => void;
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
  device?: {
    camera: InputDeviceInfo;
    microphone: InputDeviceInfo;
  };
  capabilities?: {
    camera: MediaTrackCapabilities;
    microphone: MediaTrackCapabilities;
  };
  mediaStream: MediaStream;
  resolutions?: Resolution[];
  settings?: {
    camera: MediaTrackSettings;
    microphone: MediaTrackSettings;
  };
  state: {
    muteAudio: boolean;
    displayVideo: boolean;
  };
  type: StreamTypes;
}

export type StreamId = string;

export type StreamsAction =
  | {
      id: StreamId;
      stream: Stream;
      type: StreamsActionType.ADD_STREAM;
    }
  | {
      id: StreamId;
      mediaStream: MediaStream;
      type: StreamsActionType.APPLY_CONSTRAINTS;
    }
  | {
      type: StreamsActionType.REMOVE_STREAM;
      id: StreamId;
    }
  | {
      type: StreamsActionType.RESET;
    }
  | {
      type: StreamsActionType.TOGGLE_AUDIO;
      id: StreamId;
    }
  | {
      type: StreamsActionType.TOGGLE_VIDEO;
      id: StreamId;
    };

export type StreamsMap = Map<StreamId, Stream>;

export enum StreamsActionType {
  ADD_STREAM = 'ADD_STREAM',
  APPLY_CONSTRAINTS = 'APPLY_CONSTRAINTS',
  REMOVE_STREAM = 'REMOVE_STREAM',
  RESET = 'RESET',
  TOGGLE_AUDIO = 'TOGGLE_AUDIO',
  TOGGLE_VIDEO = 'TOGGLE_VIDEO',
}

export enum StreamTypes {
  DISPLAY = 'DISPLAY',
  LOCAL = 'LOCAL',
  MEDIA = 'MEDIA',
}

export interface UseMediaDevicesArguments {
  filterOutUsedDevices?: boolean;
  handleError?: (error: string) => void;
}
