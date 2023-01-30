import { PublisherAction, PublisherActionType, PublisherSource, PublisherSources } from './types';

const reducer = (state: PublisherSources, action: PublisherAction): PublisherSources => {
  switch (action.type) {
    case PublisherActionType.ADD_SOURCE: {
      const { sourceId } = action.source.broadcastOptions;

      const newState = new Map([...state, [sourceId, action.source]]);

      return newState;
    }

    case PublisherActionType.REMOVE_SOURCE: {
      const newState = new Map(state);
      newState.delete(action.sourceId);

      return newState;
    }

    case PublisherActionType.UPDATE_SOURCE_STATE: {
      const prevSource = state.get(action.sourceId);

      if (!prevSource) {
        return state;
      }

      const newSource: PublisherSource = {
        ...prevSource,
        state: action.state,
      };

      const newState = new Map([...state, [action.sourceId, newSource]]);

      return newState;
    }

    case PublisherActionType.UPDATE_SOURCE_BITRATE: {
      const prevSource = state.get(action.sourceId);

      if (!prevSource) {
        return state;
      }

      const newSource: PublisherSource = {
        ...prevSource,
        broadcastOptions: {
          ...prevSource.broadcastOptions,
          bandwidth: action.bitrate,
        },
      };

      const newState = new Map([...state, [action.sourceId, newSource]]);

      return newState;
    }

    case PublisherActionType.UPDATE_SOURCE_STATISTICS: {
      const prevSource = state.get(action.sourceId);

      if (!prevSource) {
        return state;
      }

      const newSource = {
        ...prevSource,
        statistics: action.statistics,
      } as PublisherSource;

      const newState = new Map([...state, [action.sourceId, newSource]]);

      return newState;
    }

    default:
      return state;
  }
};

export default reducer;
