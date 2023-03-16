export interface ApplyConstraintsOptions {
  audioConstraints?: MediaTrackConstraints;
  videoConstraints?: MediaTrackConstraints;
}

export interface CreateStreamOptions {
  label?: string;
  mediaStream?: MediaStream;
  objectUrl?: string;
  type: StreamTypes;
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
      stream: Partial<Stream>;
      type: StreamsActionType.UPDATE_STREAM;
      id: string;
    };

export enum StreamsActionType {
  ADD_STREAM = 'ADD_STREAM',
  REMOVE_STREAM = 'REMOVE_STREAM',
  UPDATE_STREAM = 'UPDATE_STREAM',
}

export type StreamsMap = Map<string, Stream>;

export enum StreamTypes {
  DISPLAY = 'DISPLAY',
  LOCAL = 'LOCAL',
  MEDIA = 'MEDIA',
}

export interface UseMultiMediaStreams {
  localFiles?: {
    label: string;
    objectUrl: string;
  }[];
  mediaDevices?: MediaStream[];
  screenShare?: MediaStream[];
}
