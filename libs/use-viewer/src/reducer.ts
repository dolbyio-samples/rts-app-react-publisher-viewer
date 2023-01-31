import { RemoteTrackSources, ViewerAction, ViewerActionType } from './types';
import { buildQualityOptions } from './utils';

const reducer = (state: RemoteTrackSources, action: ViewerAction): RemoteTrackSources => {
  switch (action.type) {
    case ViewerActionType.ADD_SOURCE: {
      const { sourceId, remoteTrackSource } = action;

      const newState = new Map([...state, [sourceId, remoteTrackSource]]);

      return newState;
    }

    case ViewerActionType.REMOVE_SOURCE: {
      const newState = new Map(state);
      newState.delete(action.sourceId);

      return newState;
    }

    case ViewerActionType.UPDATE_SOURCES_STATISTICS: {
      const { audio, video } = action.statistics;

      const newState = new Map(state);

      Array.from(state).forEach(([sourceId, remoteTrackSource]) => {
        const { audioMediaId, videoMediaId } = remoteTrackSource;

        const audioIn = audio.inbounds?.filter(({ mid }) => mid === audioMediaId) ?? [];
        const videoIn = video.inbounds?.filter(({ mid }) => mid === videoMediaId) ?? [];

        if (audioIn.length && videoIn.length) {
          const newRemoteTrackSource = {
            ...remoteTrackSource,
            statistics: {
              ...action.statistics,
              audio: { inbounds: audioIn },
              video: { inbounds: videoIn },
            },
          };

          newState.set(sourceId, newRemoteTrackSource);
        }
      });

      return newState;
    }

    case ViewerActionType.UPDATE_SOURCE_QUALITY: {
      const { quality, sourceId } = action;

      const newState = new Map(state);
      const prevRamoteTrackSource = state.get(sourceId);

      if (prevRamoteTrackSource) {
        newState.set(sourceId, { ...prevRamoteTrackSource, quality });
      }

      return newState;
    }

    case ViewerActionType.UPDATE_SOURCES_QUALITY_OPTIONS: {
      const newState = new Map(state);

      Object.entries(action.medias).forEach(([mid, { active }]) => {
        const [sourceId, remoteTrackSource] =
          Array.from(state).find(([, { videoMediaId }]) => videoMediaId === mid) ?? [];

        if (sourceId && remoteTrackSource) {
          const newRemoteTrackSource = {
            ...remoteTrackSource,
            streamQualityOptions: buildQualityOptions(active),
          };

          newState.set(sourceId, newRemoteTrackSource);
        }
      });

      return newState;
    }

    default:
      return state;
  }
};

export default reducer;
