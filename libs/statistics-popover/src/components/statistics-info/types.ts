import { InputAudio, InputVideo, OutputAudio, OutputVideo } from '@dolbyio/webrtc-stats';

export interface StatisticsInfoProps {
  statistics?: {
    audio?: InputAudio | OutputAudio;
    availableOutgoingBitrate?: number;
    candidateType?: string;
    currentRoundTripTime?: number;
    raw?: {
      size: number;
    };
    totalRoundTripTime?: number;
    video?: InputVideo | OutputVideo;
  };
}
