import { LayerInfo, Media, StreamStats } from '@millicast/sdk';

export enum ViewerActionType {
  ADD_SOURCE = 'ADD_SOURCE',
  REMOVE_SOURCE = 'REMOVE_SOURCE',
  UPDATE_SOURCES_STATISTICS = 'UPDATE_SOURCES_STATISTICS',
  UPDATE_SOURCE_QUALITY = 'UPDATE_SOURCE_QUALITY',
  UPDATE_SOURCES_QUALITY_OPTIONS = 'UPDATE_SOURCES_QUALITY_OPTIONS',
}

export interface RemoteTrackSource {
  audioMediaId?: string;
  quality?: StreamQuality;
  mediaStream: MediaStream;
  sourceId: SourceId;
  statistics?: StreamStats;
  streamQualityOptions: SimulcastQuality[];
  videoMediaId?: string;
}

export type RemoteTrackSources = Map<SourceId, RemoteTrackSource>;

export type SimulcastQuality = {
  simulcastLayer?: LayerInfo; // Auto has an idx of null
  streamQuality: StreamQuality;
};

export type SourceId = string;

export type StreamQuality = 'Auto' | 'High' | 'Medium' | 'Low';

export interface Viewer {
  mainMediaStream?: MediaStream;
  projectToMainStream: (sourceId: SourceId, prevSourceId?: SourceId) => void;
  remoteTrackSources: RemoteTrackSources;
  setSourceQuality: (sourceId: SourceId, quality: SimulcastQuality) => void;
  startViewer: () => void;
  stopViewer: () => void;
  viewerCount: number;
}

export type ViewerAction =
  | {
      remoteTrackSource: RemoteTrackSource;
      sourceId: SourceId;
      type: ViewerActionType.ADD_SOURCE;
    }
  | { sourceId: SourceId; type: ViewerActionType.REMOVE_SOURCE }
  | { statistics: StreamStats; type: ViewerActionType.UPDATE_SOURCES_STATISTICS }
  | { quality: StreamQuality; sourceId: SourceId; type: ViewerActionType.UPDATE_SOURCE_QUALITY }
  | { medias: Media[]; type: ViewerActionType.UPDATE_SOURCES_QUALITY_OPTIONS };

export interface ViewerProps {
  handleError?: (error: string) => void;
  streamAccountId: string;
  streamName: string;
  subscriberToken?: string;
}
