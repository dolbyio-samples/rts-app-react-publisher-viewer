import { OnStats } from '@dolbyio/webrtc-stats';
import { LayerInfo } from '@millicast/sdk';

export enum ViewerActionType {
  ADD_SOURCE = 'ADD_SOURCE',
  REMOVE_SOURCE = 'REMOVE_SOURCE',
  UPDATE_SOURCE_MEDIA = 'UPDATE_SOURCE_MEDIA',
  UPDATE_SOURCE_QUALITY = 'UPDATE_SOURCE_QUALITY',
}

export interface RemoteTrackSource {
  mediaStream?: MediaStream;
  quality?: StreamQuality;
  sourceId: string;
  audioMediaId?: string;
  audioTrackId?: string;
  videoMediaId?: string;
  videoTrackId?: string;
}

export type RemoteTrackSources = Map<string, RemoteTrackSource>;

export type SimulcastQuality = {
  simulcastLayer?: LayerInfo; // Auto has an idx of null
  streamQuality: StreamQuality;
};

export type StreamQuality = 'Auto' | 'High' | 'Medium' | 'Low';

export interface Viewer {
  mainMediaStream?: MediaStream;
  mainSourceId?: string;
  mainQualityOptions: SimulcastQuality[];
  mainStatistics?: OnStats;
  projectToMainStream: (sourceId: string, shouldSwap: boolean) => Promise<RemoteTrackSource | void>;
  remoteTrackSources: RemoteTrackSources;
  setSourceQuality: (sourceId: string, quality?: SimulcastQuality) => void;
  startViewer: () => void;
  stopViewer: () => void;
  viewerCount: number;
}

export type ViewerAction =
  | {
      remoteTrackSource: RemoteTrackSource;
      sourceId: string;
      type: ViewerActionType.ADD_SOURCE;
    }
  | { sourceId: string; type: ViewerActionType.REMOVE_SOURCE }
  | {
      payload: { sourceId: string; mediaStream?: MediaStream; audioMID?: string; videoMID?: string }[];
      type: ViewerActionType.UPDATE_SOURCE_MEDIA;
    }
  | { quality: StreamQuality; sourceId: string; type: ViewerActionType.UPDATE_SOURCE_QUALITY };

export interface ViewerProps {
  handleError?: (error: string) => void;
  streamAccountId: string;
  streamName: string;
  subscriberToken?: string;
}
