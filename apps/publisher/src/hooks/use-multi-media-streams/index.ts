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
 * This hook manages the state of mediastreams and object URLs from multiple input types including media
 * devices (e.g. cameras, microphones), screenshare instances, and locally uploaded media files. The hook
 * provides enhanced functionality such as the ability to adjust mediastream constraints, as well as
 * supplementary information for each item stored in state (e.g. the source type, the user-designated label,
 * and a list of valid resolutions to reconstrain to). This hook is designed to work with and manage the
 * mediastreams of useMediaDevice, useScreenShare, and useLocalFile.
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

  const updateStream = (id: string, stream: Partial<Stream>) => {
    dispatch({ id, stream, type: StreamsActionType.UPDATE_STREAM });
  };

  return {
    applyConstraints,
    streams,
  };
};

export * from './constants';
export * from './types';
export default useMultiMediaStreams;
