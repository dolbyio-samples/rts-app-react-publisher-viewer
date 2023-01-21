import { RemoteTrackSources, ViewerAction, ViewerActionType } from './types';
import { buildQualityOptions } from './utils';

const reducer = (remoteTrackSources: RemoteTrackSources, action: ViewerAction): RemoteTrackSources => {
  switch (action.type) {
    case ViewerActionType.ADD_SOURCE: {
      const { sourceId, remoteTrackSource } = action;

      const newRemoteTrackSources = new Map([[sourceId, remoteTrackSource], ...remoteTrackSources]);

      return newRemoteTrackSources;
    }

    case ViewerActionType.REMOVE_SOURCE: {
      const newRemoteTrackSources = new Map(remoteTrackSources) as RemoteTrackSources;
      newRemoteTrackSources.delete(action.sourceId);

      return newRemoteTrackSources;
    }

    case ViewerActionType.UPDATE_SOURCES_STATISTICS: {
      const { audio, video } = action.statistics;

      const newRemoteTrackSources = new Map(remoteTrackSources);

      Array.from(remoteTrackSources).forEach(([sourceId, remoteTrackSource]) => {
        const { audioMediaId, videoMediaId } = remoteTrackSource;

        const audioIn = audio.inbounds?.filter(({ mid }) => mid === audioMediaId) ?? [];
        const videoIn = video.inbounds?.filter(({ mid }) => mid === videoMediaId) ?? [];

        const newRemoteTrackSource = {
          ...remoteTrackSource,
          statistics: {
            ...action.statistics,
            audio: { inbounds: audioIn },
            video: { inbounds: videoIn },
          },
        };

        newRemoteTrackSources.set(sourceId, newRemoteTrackSource);
      });

      return newRemoteTrackSources;
    }

    case ViewerActionType.UPDATE_SOURCE_QUALITY: {
      const { quality, sourceId } = action;

      const newRemoteTrackSources = new Map(remoteTrackSources);
      const prevRamoteTrackSource = remoteTrackSources.get(sourceId);

      if (prevRamoteTrackSource) {
        newRemoteTrackSources.set(sourceId, { ...prevRamoteTrackSource, quality });
      }

      return newRemoteTrackSources;
    }

    case ViewerActionType.UPDATE_SOURCES_QUALITY_OPTIONS: {
      const newRemoteTrackSources = new Map(remoteTrackSources);

      Object.entries(action.medias).forEach(([mid, { active }]) => {
        const [sourceId, remoteTrackSource] =
          Array.from(remoteTrackSources).find(([, { videoMediaId }]) => videoMediaId === mid) ?? [];

        if (sourceId && remoteTrackSource) {
          const newRemoteTrackSource = {
            ...remoteTrackSource,
            streamQualityOptions: buildQualityOptions(active),
          };

          newRemoteTrackSources.set(sourceId, newRemoteTrackSource);
        }
      });

      return newRemoteTrackSources;
    }

    default:
      return remoteTrackSources;
  }
};

export default reducer;
