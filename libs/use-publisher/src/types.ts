import WebRTCStats, { OnStats } from '@dolbyio/webrtc-stats';
import { BroadcastOptions, Publish, VideoCodec } from '@millicast/sdk';

export interface Bitrate {
  name: string;
  value: number;
}

export enum PublisherActionType {
  ADD_SOURCE = 'ADD_SOURCE',
  REMOVE_SOURCE = 'REMOVE_SOURCE',
  UPDATE_SOURCE_BROADCAST_OPTIONS = 'UPDATE_SOURCE_BROADCAST_OPTIONS',
  UPDATE_SOURCE_MEDIA_STREAM = 'UPDATE_SOURCE_MEDIA_STREAM',
  UPDATE_SOURCE_STATE = 'UPDATE_SOURCE_STATE',
  UPDATE_SOURCE_STATISTICS = 'UPDATE_SOURCE_STATISTICS',
}

export interface Publisher {
  codecList: VideoCodec[];
  shareUrl?: string;
  sources: PublisherSources;
  // startStreamingToSource will add a new stream to publisher
  startStreamingToSource: (id: string, mediaStream?: MediaStream) => Promise<void>;
  // stopStreamingToSource will remove an existing stream from publisher
  stopStreamingToSource: (id: string) => void;
  updateSourceMediaStream: (id: string, mediaStream: MediaStream) => void;
  updateSourceBroadcastOptions: (id: string, broadcastOptions: Partial<BroadcastOptions>) => void;
  startRecording: (sourceId: string) => Promise<void>;
  stopRecording: (sourceId: string) => Promise<void>;
  viewerCount: number;
}

export type PublisherAction =
  | { source: PublisherSource; id: string; type: PublisherActionType.ADD_SOURCE }
  | { id: string; type: PublisherActionType.REMOVE_SOURCE }
  | {
      broadcastOptions: Partial<BroadcastOptions>;
      id: string;
      type: PublisherActionType.UPDATE_SOURCE_BROADCAST_OPTIONS;
    }
  | { id: string; mediaStream: MediaStream; type: PublisherActionType.UPDATE_SOURCE_MEDIA_STREAM }
  | { id: string; state: SourceState; type: PublisherActionType.UPDATE_SOURCE_STATE }
  | { id: string; statistics: OnStats; type: PublisherActionType.UPDATE_SOURCE_STATISTICS };

export interface PublisherProps {
  handleError?: (error: string) => void;
  streamNameId: string;
  streams: Map<string, { label?: string; mediaStream?: MediaStream }>;
  streamName: string;
  token: string;
  viewerAppBaseUrl?: string;
}

export interface PublisherSource {
  broadcastOptions: Omit<BroadcastOptions, 'mediaStream'> & { mediaStream?: MediaStream };
  collection: WebRTCStats;
  publish: Publish;
  state: SourceState;
  statistics?: OnStats;
}

export type PublisherSources = Map<string, PublisherSource>;

export interface PublisherStream {
  label: string;
  mediaStream: MediaStream;
}

export type SourceState = 'ready' | 'connecting' | 'streaming';
