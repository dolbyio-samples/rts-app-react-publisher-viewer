import { BoxProps } from '@chakra-ui/react';
import { StreamStats } from '@millicast/sdk';
import { ReactNode } from 'react';

import { SettingsDrawerProps } from './components/settings-drawer';

export type VideoViewProps = {
  displayFullscreenButton?: boolean;
  displayMuteButton?: boolean;
  displayVideo?: boolean;
  height: string;
  label?: string;
  mediaStream?: MediaStream;
  mirrored?: boolean;
  muted?: boolean;
  onClick?: BoxProps['onClick'];
  onError?: (error: MediaError) => void;
  onSrcMediaStreamClose?: (id: string) => void;
  onSrcMediaStreamReady?: (value: MediaStream) => void;
  placeholderNode?: ReactNode;
  settings?: Omit<SettingsDrawerProps, 'isOpen' | 'onClose'>;
  showDotIndicator?: boolean;
  src?: string;
  statistics?: StreamStats;
  volume?: number;
  width: string;
};
