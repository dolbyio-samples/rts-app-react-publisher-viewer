import { PublisherAction, PublisherActionType, PublisherSource, PublisherSources } from './types';

const reducer = (state: PublisherSources, action: PublisherAction): PublisherSources => {
  switch (action.type) {
    case PublisherActionType.ADD_SOURCE: {
      const newState = new Map([...state, [action.id, action.source]]);

      return newState;
    }

    case PublisherActionType.REMOVE_SOURCE: {
      const newState = new Map(state);

      newState.delete(action.id);

      return newState;
    }

    case PublisherActionType.UPDATE_SOURCE_STATE: {
      const prevSource = state.get(action.id);

      if (!prevSource) {
        return state;
      }

      const newSource: PublisherSource = {
        ...prevSource,
        state: action.state,
      };

      const newState = new Map([...state, [action.id, newSource]]);

      return newState;
    }

    case PublisherActionType.UPDATE_SOURCE_BROADCAST_OPTIONS: {
      const prevSource = state.get(action.id);

      if (!prevSource) {
        return state;
      }

      const newSource: PublisherSource = {
        ...prevSource,
        broadcastOptions: {
          ...prevSource.broadcastOptions,
          ...action.broadcastOptions,
        },
      };

      const newState = new Map([...state, [action.id, newSource]]);

      return newState;
    }

    case PublisherActionType.UPDATE_SOURCE_STATISTICS: {
      const prevSource = state.get(action.id);

      if (!prevSource) {
        return state;
      }

      const newSource = {
        ...prevSource,
        statistics: action.statistics,
      } as PublisherSource;

      const newState = new Map([...state, [action.id, newSource]]);

      return newState;
    }

    default:
      return state;
  }
};

export default reducer;
