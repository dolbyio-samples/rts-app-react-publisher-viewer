import { LayerInfo, StreamAudioInboundsStats, StreamVideoInboundsStats, View } from '@millicast/sdk';

export enum ViewerActionType {
  ADD_SOURCE = 'ADD_SOURCE',
  REMOVE_SOURCE = 'REMOVE_SOURCE',
}

export type RemoteTrackSource = {
  audioMediaId?: string;
  mediaStream: MediaStream;
  sourceId: SourceId;
  statistics?: {
    audio: StreamAudioInboundsStats[];
    video: StreamVideoInboundsStats[];
  };
  streamQualityOptions: SimulcastQuality[];
  videoMediaId?: string;
};

export type RemoteTrackSources = Map<SourceId, RemoteTrackSource>;

export type SimulcastQuality = {
  simulcastLayer?: LayerInfo; // Auto has an idx of null
  streamQuality: StreamQuality;
};

export type SourceId = string;

export type StreamQuality = 'Auto' | 'High' | 'Medium' | 'Low';

export type Viewer = {
  startViewer: () => void;
  stopViewer: () => void;
  remoteTrackSources: RemoteTrackSources;
  // updateSourceQuality: (sourceId: SourceId, quality: StreamQuality) => void;
  viewerCount: number;
};

export type ViewerAction =
  | { source: RemoteTrackSource; type: ViewerActionType.ADD_SOURCE }
  | { sourceId: SourceId; type: ViewerActionType.REMOVE_SOURCE; viewer: View };

export type ViewerProps = {
  handleError?: (error: string) => void;
  streamAccountId: string;
  streamName: string;
  subscriberToken?: string;
};
