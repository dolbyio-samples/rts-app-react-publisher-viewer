import { Stream, StreamsAction, StreamsActionType, StreamsMap } from './types';
import { stopTracks } from './utils';

const reducer = (state: StreamsMap, action: StreamsAction) => {
  switch (action.type) {
    case StreamsActionType.ADD_STREAM: {
      const prevStream = state.get(action.id);

      if (prevStream) {
        stopTracks(prevStream.mediaStream);
      }

      const newState = new Map(state);
      newState.set(action.id, action.stream);

      return newState;
    }

    case StreamsActionType.REMOVE_STREAM: {
      const prevStream = state.get(action.id);

      if (prevStream) {
        stopTracks(prevStream.mediaStream);
      }

      const newState = new Map(state);
      newState.delete(action.id);

      return newState;
    }

    case StreamsActionType.RESET: {
      state.forEach((stream) => {
        stopTracks(stream.mediaStream);
      });

      return new Map<string, Stream>();
    }

    case StreamsActionType.TOGGLE_AUDIO: {
      const newState = new Map(state);
      const prevStream = state.get(action.id);

      if (prevStream) {
        const audioTracks = prevStream.mediaStream.getAudioTracks();

        if (audioTracks.length) {
          audioTracks[0].enabled = !audioTracks[0].enabled;

          newState.set(action.id, {
            ...prevStream,
            state: {
              ...prevStream.state,
              muteAudio: !prevStream.state.muteAudio,
            },
          });
        }
      }

      return newState;
    }

    case StreamsActionType.TOGGLE_VIDEO: {
      const prevStream = state.get(action.id);
      const newState = new Map(state);

      if (prevStream) {
        const videoTracks = prevStream.mediaStream.getVideoTracks();

        if (videoTracks.length) {
          videoTracks[0].enabled = !videoTracks[0].enabled;

          newState.set(action.id, {
            ...prevStream,
            state: {
              ...prevStream.state,
              displayVideo: !prevStream.state.displayVideo,
            },
          });
        }
      }

      return newState;
    }

    case StreamsActionType.UPDATE_STREAM: {
      const newState = new Map(state);
      const prevStream = state.get(action.id);

      if (prevStream) {
        newState.set(action.id, {
          ...prevStream,
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
