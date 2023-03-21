import { OnStats } from '@dolbyio/webrtc-stats';
import { LayerInfo, ViewProjectSourceMapping } from '@millicast/sdk';

export enum ViewerActionType {
  ADD_SOURCE = 'ADD_SOURCE',
  REMOVE_SOURCE = 'REMOVE_SOURCE',
  UPDATE_SOURCE_QUALITY = 'UPDATE_SOURCE_QUALITY',
}

export interface RemoteTrackSource {
  audioMediaId?: string;
  mediaStream: MediaStream;
  projectMapping: ViewProjectSourceMapping[];
  quality?: StreamQuality;
  sourceId?: string;
  videoMediaId?: string;
}

export type RemoteTrackSources = Map<string, RemoteTrackSource>;

export type SimulcastQuality = {
  simulcastLayer?: LayerInfo; // Auto has an idx of null
  streamQuality: StreamQuality;
};

export type StreamQuality = 'Auto' | 'High' | 'Medium' | 'Low';

export interface Viewer {
  mainMediaStream?: MediaStream;
  mainQualityOptions: SimulcastQuality[];
  mainStatistics?: OnStats;
  projectToMainStream: (sourceId?: string) => Promise<RemoteTrackSource | void>;
  remoteTrackSources: RemoteTrackSources;
  reprojectFromMainStream: (sourceId?: string) => void;
  setSourceQuality: (sourceId?: string, quality?: SimulcastQuality) => void;
  startViewer: () => void;
  stopViewer: () => void;
  viewerCount: number;
}

export type ViewerAction =
  | {
      remoteTrackSource: RemoteTrackSource;
      sourceId?: string;
      type: ViewerActionType.ADD_SOURCE;
    }
  | { sourceId?: string; type: ViewerActionType.REMOVE_SOURCE }
  | { quality: StreamQuality; sourceId?: string; type: ViewerActionType.UPDATE_SOURCE_QUALITY };

export interface ViewerProps {
  handleError?: (error: string) => void;
  streamAccountId: string;
  streamName: string;
  subscriberToken?: string;
}
