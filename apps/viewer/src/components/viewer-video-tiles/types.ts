import { OnStats } from '@dolbyio/webrtc-stats';

import { RemoteTrackSource, RemoteTrackSources, SimulcastQuality } from '#millicast-react/use-viewer';

export interface ViewerVideoTilesProps {
  mainMediaStream?: MediaStream;
  mainQualityOptions: SimulcastQuality[];
  mainStatistics?: OnStats;
  projectToMainStream: (sourceId?: string | undefined) => Promise<void | RemoteTrackSource>;
  remoteTrackSources: RemoteTrackSources;
  reprojectFromMainStream: (sourceId?: string | undefined) => void;
  setSourceQuality: (sourceId?: string | undefined, quality?: SimulcastQuality | undefined) => void;
}
