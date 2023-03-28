import { BroadcastOptions, VideoCodec } from '@millicast/sdk';

import { PublisherSources } from '@millicast-react/use-publisher';

import { ApplyConstraintsOptions, StreamsMap } from '../../hooks/use-multi-media-streams';

export interface PublisherVideoTilesProps {
  allSourcesLive: boolean;
  applyConstraints: (id: string, constraints: ApplyConstraintsOptions) => Promise<void>;
  codecList: VideoCodec[];
  onRemoveSource: (id: string) => (() => void) | undefined;
  onStartSource: (id: string, mediaStream?: MediaStream) => () => void;
  onStopSource: (id: string) => () => void;
  sources: PublisherSources;
  streams: StreamsMap;
  updateSourceBroadcastOptions: (id: string, broadcastOptions: Partial<BroadcastOptions>) => void;
  updateSourceMediaStream: (id: string, mediaStream: MediaStream) => void;
}
