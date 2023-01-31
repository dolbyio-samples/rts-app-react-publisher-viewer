import { BroadcastOptions, Publish, StreamStats, VideoCodec } from '@millicast/sdk';

export enum PublisherActionType {
  ADD_SOURCE = 'ADD_SOURCE',
  REMOVE_SOURCE = 'REMOVE_SOURCE',
  UPDATE_SOURCE_BITRATE = 'UPDATE_SOURCE_BITRATE',
  UPDATE_SOURCE_STATE = 'UPDATE_SOURCE_STATE',
  UPDATE_SOURCE_STATISTICS = 'UPDATE_SOURCE_STATISTICS',
}

export type Bitrate = {
  name: string;
  value: number;
};

export type Publisher = {
  bitrateList: Bitrate[];
  codecList: VideoCodec[];
  shareUrl?: string;
  sources: PublisherSources;
  // startStreaming will add a new source to publisher
  startStreamingSource: (options: BroadcastOptions) => void;
  // stopStreaming will remove an exsiting source from publisher
  stopStreamingSource: (sourceId: string) => void;
  updateSourceMediaStream: (sourceId: string, mediaStream: MediaStream) => void;
  updateSourceBitrate: (sourceId: string, bitrate: number) => void;
  viewerCount: number;
};

export type PublisherAction =
  | { type: PublisherActionType.ADD_SOURCE; source: PublisherSource }
  | { type: PublisherActionType.REMOVE_SOURCE; sourceId: SourceId }
  | { type: PublisherActionType.UPDATE_SOURCE_BITRATE; sourceId: SourceId; bitrate: number }
  | { type: PublisherActionType.UPDATE_SOURCE_STATE; sourceId: SourceId; state: SourceState }
  | { type: PublisherActionType.UPDATE_SOURCE_STATISTICS; sourceId: SourceId; statistics: StreamStats };

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

export type PublisherSources = Map<SourceId, PublisherSource>;

export type SourceId = string;

export type SourceState = 'ready' | 'connecting' | 'streaming';
