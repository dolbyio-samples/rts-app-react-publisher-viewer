export interface ApplyConstraintsOptions {
  audioConstraints?: MediaTrackConstraints;
  videoConstraints?: MediaTrackConstraints;
}

export interface CreateStreamOptions {
  audioConstraints?: MediaTrackConstraints;
  camera?: InputDeviceInfo;
  label?: string;
  microphone?: InputDeviceInfo;
  objectUrl?: string;
  type: StreamTypes;
  videoConstraints?: MediaTrackConstraints;
}

export interface MediaDevices {
  addStream: (options: CreateStreamOptions) => Promise<void>;
  applyConstraints: (id: string, options: ApplyConstraintsOptions) => Promise<void>;
  cameraList: InputDeviceInfo[];
  initDefaultStream: () => void;
  streams: StreamsMap;
  microphoneList: InputDeviceInfo[];
  removeStream: (id: string) => void;
  reset: () => void;
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
  label?: string;
  mediaStream?: MediaStream;
  objectUrl?: string;
  resolutions?: Resolution[];
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
      stream: Partial<Stream>;
      type: StreamsActionType.UPDATE_STREAM;
      id: string;
    };

export enum StreamsActionType {
  ADD_STREAM = 'ADD_STREAM',
  REMOVE_STREAM = 'REMOVE_STREAM',
  RESET = 'RESET',
  UPDATE_STREAM = 'UPDATE_STREAM',
}

export type StreamsMap = Map<string, Stream>;

export enum StreamTypes {
  DISPLAY = 'DISPLAY',
  LOCAL = 'LOCAL',
  MEDIA = 'MEDIA',
}

export interface UseMediaDevicesProps {
  filterOutUsedDevices?: boolean;
  handleError?: (error: string) => void;
}
