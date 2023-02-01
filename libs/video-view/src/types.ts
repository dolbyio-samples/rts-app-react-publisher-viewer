import { BoxProps } from '@chakra-ui/react';
import { StreamStats } from '@millicast/sdk';
import { ReactNode } from 'react';

export interface HTMLVideoElementWithCaptureStream extends HTMLVideoElement {
  captureStream: (frameRequestRate?: number) => MediaStream;
}

export interface VideoViewProps {
  displayVideo?: boolean;
  height?: string;
  isFullScreen?: boolean;
  label?: string;
  maxHeight?: string;
  maxWidth?: string;
  mediaStream?: MediaStream;
  mirrored?: boolean;
  muted?: boolean;
  onClick?: BoxProps['onClick'];
  onError?: (error: MediaError) => void;
  onSrcMediaStreamClose?: (id: string) => void;
  onSrcMediaStreamReady?: (value: MediaStream) => void;
  placeholderNode?: ReactNode;
  playing?: boolean;
  showDotIndicator?: boolean;
  src?: string;
  statistics?: StreamStats;
  volume?: number;
  width?: string;
}
