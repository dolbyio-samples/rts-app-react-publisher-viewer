import { RemoteTrackSources, ViewerAction, ViewerActionType } from './types';

const reducer = (state: RemoteTrackSources, action: ViewerAction): RemoteTrackSources => {
  switch (action.type) {
    case ViewerActionType.ADD_SOURCE: {
      const { sourceId, remoteTrackSource } = action;
      const newState = new Map(state);
      newState.set(sourceId, remoteTrackSource);
      return newState;
    }

    case ViewerActionType.REMOVE_SOURCE: {
      const newState = new Map(state);
      newState.delete(action.sourceId);
      return newState;
    }

    case ViewerActionType.UPDATE_SOURCE_MEDIA: {
      const newState = new Map(state);
      action.payload.forEach(({ sourceId, mediaStream, audioMID, videoMID }) => {
        const trackSource = newState.get(sourceId);
        if (trackSource) {
          trackSource.mediaStream = mediaStream;
          trackSource.audioMediaId = audioMID;
          trackSource.videoMediaId = videoMID;
        }
      });
      return newState;
    }

    case ViewerActionType.UPDATE_SOURCE_QUALITY: {
      const { quality, sourceId } = action;
      const newState = new Map(state);
      const prevRemoteTrackSource = state.get(sourceId);
      if (prevRemoteTrackSource) {
        newState.set(sourceId, { ...prevRemoteTrackSource, quality });
      }
      return newState;
    }

    default:
      return state;
  }
};

export default reducer;
