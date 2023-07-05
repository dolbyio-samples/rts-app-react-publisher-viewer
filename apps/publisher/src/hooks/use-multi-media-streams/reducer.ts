import { StreamsAction, StreamsActionType, StreamsMap } from './types';
import { stopTracks } from './utils';

const reducer = (state: StreamsMap, action: StreamsAction) => {
  switch (action.type) {
    case StreamsActionType.ADD_STREAM: {
      const prevMediaStream = state.get(action.id);

      if (prevMediaStream?.mediaStream) {
        stopTracks(prevMediaStream.mediaStream);
      }

      const newState = new Map(state);
      newState.set(action.id, action.stream);

      return newState;
    }

    case StreamsActionType.REMOVE_STREAM: {
      const prevMediaStream = state.get(action.id);

      if (prevMediaStream?.mediaStream) {
        stopTracks(prevMediaStream.mediaStream);
      }

      const newState = new Map(state);
      newState.delete(action.id);

      return newState;
    }

    case StreamsActionType.UPDATE_STREAM: {
      const newState = new Map(state);
      const prevMediaStream = state.get(action.id);

      if (prevMediaStream) {
        newState.set(action.id, {
          ...prevMediaStream,
          ...action.stream,
        });
      }

      return newState;
    }

    default:
      return state;
  }
};

export default reducer;
