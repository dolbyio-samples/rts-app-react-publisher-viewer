import { BoxProps } from '@chakra-ui/react';
import { OnStats } from '@dolbyio/webrtc-stats';
import { ReactNode } from 'react';

export interface HTMLVideoElementWithCaptureStream extends HTMLVideoElement {
  captureStream: (frameRequestRate?: number) => MediaStream;
}

export interface VideoViewProps {
  displayVideo?: boolean;
  height?: string;
  label?: string;
  mediaStream?: MediaStream;
  mirrored?: boolean;
  muted?: boolean;
  onClick?: BoxProps['onClick'];
  onError?: (error: MediaError) => void;
  onSrcMediaStreamClose?: (id: string) => void;
  onSrcMediaStreamReady?: (value: MediaStream) => void;
  placeholderNode?: ReactNode;
  paused?: boolean;
  showDotIndicator?: boolean;
  src?: string;
  statistics?: OnStats;
  volume?: number;
  width?: string;
}
