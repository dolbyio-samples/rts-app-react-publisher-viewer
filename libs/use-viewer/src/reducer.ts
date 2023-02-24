import { RemoteTrackSources, ViewerAction, ViewerActionType } from './types';

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
