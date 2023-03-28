import { StartDeviceProps } from '@millicast-react/use-media-devices';
import { PublisherSources } from '@millicast-react/use-publisher';

import { StreamsMap } from '../../hooks/use-multi-media-streams';

export interface ActionBarProps {
  audioDevices: InputDeviceInfo[];
  onAddLocalFile: (file: File) => void;
  onStartAllSources: () => void;
  onStartMediaDevice: (config: StartDeviceProps) => Promise<void>;
  onStartScreenShare: () => Promise<void>;
  onStopAllSources: () => void;
  maxSources?: number;
  shareUrl?: string;
  sources: PublisherSources;
  streams: StreamsMap;
  videoDevices: InputDeviceInfo[];
}
