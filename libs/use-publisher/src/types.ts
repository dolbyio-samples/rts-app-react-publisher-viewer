import { BroadcastOptions, Publish, StreamStats } from '@millicast/sdk';

export enum PublisherActionType {
  ADD_SOURCE = 'ADD_SOURCE',
  REMOVE_SOURCE = 'REMOVE_SOURCE',
  UPDATE_SOURCE_BITRATE = 'UPDATE_SOURCE_BITRATE',
  UPDATE_SOURCE_STATE = 'UPDATE_SOURCE_STATE',
  UPDATE_SOURCE_STATISTICS = 'UPDATE_SOURCE_STATISTICS',
}

export type Publisher = {
  shareUrl?: string;
  sources: PublisherSources;
  // startStreamingToSource will add a new stream to publisher
  startStreamingToSource: (broadcastOptions: BroadcastOptions) => Promise<void>;
  // stopStreamingToSource will remove an existing stream from publisher
  stopStreamingToSource: (sourceId: string) => void;
  updateSourceBitrate: (sourceId: string, bitrate: number) => void;
  updateSourceMediaStream: (sourceId: string, mediaStream: MediaStream) => void;
  viewerCount: number;
};

export type PublisherAction =
  | { source: PublisherSource; type: PublisherActionType.ADD_SOURCE }
  | { sourceId: string; type: PublisherActionType.REMOVE_SOURCE }
  | { bitrate: number; sourceId: string; type: PublisherActionType.UPDATE_SOURCE_BITRATE }
  | { sourceId: string; state: SourceState; type: PublisherActionType.UPDATE_SOURCE_STATE }
  | { sourceId: string; statistics: StreamStats; type: PublisherActionType.UPDATE_SOURCE_STATISTICS };

export type PublisherProps = {
  handleError?: (error: string) => void;
  streamId: string;
  streamName: string;
  token: string;
  viewerAppBaseUrl?: string;
};

export type PublisherSource = {
  broadcastOptions: BroadcastOptions;
  publish: Publish;
  state: SourceState;
  statistics?: StreamStats;
};

export type PublisherSources = Map<string, PublisherSource>;

export type SourceState = 'ready' | 'connecting' | 'streaming';
