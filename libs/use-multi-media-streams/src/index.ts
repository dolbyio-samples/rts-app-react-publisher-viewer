import { useEffect, useReducer, useRef } from 'react';

import reducer from './reducer';
import {
  ApplyConstraintsOptions,
  CreateStreamOptions,
  Stream,
  StreamsActionType,
  StreamsMap,
  StreamTypes,
  UseMultiMediaStreams,
} from './types';
import { createStream } from './utils';

/**
 * Manage state of mediastreams and object URLsz from multiple input types including
 * devices (webcam, cameras, microphones), screenshare, and local file uploads
 */
const useMultiMediaStreams = ({ localFiles, mediaDevices, screenShare }: UseMultiMediaStreams = {}) => {
  const [streams, dispatch] = useReducer(reducer, new Map());

  const streamsRef = useRef<StreamsMap>(streams);
  streamsRef.current = streams;

  useEffect(() => {
    localFiles?.forEach((localFile) => {
      if (!streamsRef.current.has(localFile.objectUrl)) {
        addStream({ ...localFile, type: StreamTypes.LOCAL });
      }
    });

    cleanUpStreams();
  }, [localFiles?.length]);

  useEffect(() => {
    mediaDevices?.forEach((mediaStream) => {
      if (!streamsRef.current.has(mediaStream.id)) {
        addStream({ mediaStream, type: StreamTypes.MEDIA });
      }
    });

    cleanUpStreams();
  }, [mediaDevices?.length]);

  useEffect(() => {
    screenShare?.forEach((mediaStream) => {
      if (!streamsRef.current.has(mediaStream.id)) {
        addStream({ mediaStream, type: StreamTypes.DISPLAY });
      }
    });

    cleanUpStreams();
  }, [screenShare?.length]);

  const addStream = async (options: CreateStreamOptions) => {
    const newStream = await createStream(options);

    if (newStream) {
      dispatch({
        type: StreamsActionType.ADD_STREAM,
        ...newStream,
      });
    }
  };

  const applyConstraints = async (
    id: string,
    { audioConstraints = {}, videoConstraints = {} }: ApplyConstraintsOptions
  ) => {
    const prevStream = streams.get(id);

    if (prevStream?.mediaStream) {
      const { mediaStream } = prevStream;

      const [audioTrack] = mediaStream.getAudioTracks();
      const [videoTrack] = mediaStream.getVideoTracks();

      const applyAudioConstraints = audioTrack.applyConstraints(audioConstraints);
      const applyVideoConstraints = videoTrack.applyConstraints(videoConstraints);

      await Promise.all([applyAudioConstraints, applyVideoConstraints]);

      updateStream(id, { mediaStream });
    }
  };

  // Remove streams that are no longer accounted for
  const cleanUpStreams = () => {
    const ids = [
      ...(localFiles?.map(({ objectUrl }) => objectUrl) ?? []),
      ...(mediaDevices?.map(({ id }) => id) ?? []),
      ...(screenShare?.map(({ id }) => id) ?? []),
    ];

    const streamsToRemove = new Map(streamsRef.current);

    ids.forEach((id) => {
      if (streamsToRemove.has(id)) {
        streamsToRemove.delete(id);
      }
    });

    Array.from(streamsToRemove).forEach(([id]) => {
      removeStream(id);
    });
  };

  const removeStream = (id: string) => {
    dispatch({ id, type: StreamsActionType.REMOVE_STREAM });
  };

  const reset = () => {
    dispatch({ type: StreamsActionType.RESET });
  };

  const updateStream = (id: string, stream: Partial<Stream>) => {
    dispatch({ id, stream, type: StreamsActionType.UPDATE_STREAM });
  };

  return {
    addStream,
    applyConstraints,
    removeStream,
    reset,
    streams,
    updateStream,
  };
};

export * from './constants';
export * from './types';
export default useMultiMediaStreams;
