import {
  StreamAudioInboundsStats,
  StreamAudioOutboundsStats,
  StreamVideoInboundsStats,
  StreamVideoOutboundsStats,
} from '@millicast/sdk';

export interface StatisticsInfoProps {
  statistics?: {
    audio?: StreamAudioInboundsStats | StreamAudioOutboundsStats;
    availableOutgoingBitrate?: number;
    candidateType?: string;
    currentRoundTripTime?: number;
    raw?: {
      size: number;
    };
    totalRoundTripTime?: number;
    video?: StreamVideoInboundsStats | StreamVideoOutboundsStats;
  };
}
