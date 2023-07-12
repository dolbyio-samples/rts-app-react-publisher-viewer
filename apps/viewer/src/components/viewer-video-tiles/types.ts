import { OnStats } from '@dolbyio/webrtc-stats';

import { RemoteTrackSource, RemoteTrackSources, SimulcastQuality } from '@millicast-react/use-viewer';

export interface ViewerVideoTilesProps {
  mainMediaStream: MediaStream;
  mainSourceId: string;
  mainQualityOptions: SimulcastQuality[];
  mainStatistics?: OnStats;
  projectToMainStream: (sourceId: string, shouldSwap: boolean) => Promise<void | RemoteTrackSource>;
  remoteTrackSources: RemoteTrackSources;
  setSourceQuality: (sourceId: string, quality?: SimulcastQuality | undefined) => void;
}
