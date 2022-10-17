import React, { useEffect, useRef, useState } from "react";
import { Director, Publish } from '@millicast/sdk';

export type PublisherState = "ready" | "connecting" | "streaming";

export interface Publisher {
    startStreaming: (mediaStream: MediaStream) => Promise<void>;
    stopStreaming: () => void;
    updateAudioTrack: (mediaStream: MediaStream) => Promise<void>;
    updateVideoTrack: (mediaStream: MediaStream) => Promise<void>;
    publisherState: PublisherState;
}

const usePublisher = (token: string, streamName: string): Publisher => {

    const [publisherState, setPublisherState] = useState<PublisherState>("ready");
    const publisher = useRef<Publish>();

    useEffect(() => {
        console.log(token, streamName);
        const tokenGenerator = () => Director.getPublisher({ token: token, streamName: streamName });
        publisher.current = new Publish(streamName, tokenGenerator);
    }, [token, streamName]);

    // TODO, this param list can grow significantly when we add the broadcast settings option, but until such time this list will stay small
    const startStreaming = async (mediaStream: MediaStream) => {
        if (!publisher.current || publisher.current.isActive() || publisherState !== "ready") return;
        const broadcastOptions = {
            mediaStream,
            // Additional settings go here
        };
        try {
            setPublisherState("connecting");
            await publisher.current.connect(broadcastOptions);
            setPublisherState("streaming")
        } catch (e) {
            setPublisherState("ready");
            console.error(e);
        }
    };

    const stopStreaming = async () => {
        if (!publisher.current || publisher.current.isActive() || publisherState !== "streaming") return;
        await publisher.current.stop();
        setPublisherState("ready")

    }

    const updateAudioSource = async (mediaStream: MediaStream) => {
        // TODO yet to be tested
        // if (!publisher.current || publisher.current.isActive()) return;
        // await publisher.current.webRTCPeer.replaceTrack(mediaStream.getAudioTracks()[0]);
    }


    const updateVideoSource = async (mediaStream: MediaStream) => {
        // TODO yet to be tested
        // if (!publisher.current || publisher.current.isActive()) return;
        // await publisher.current.webRTCPeer.replaceTrack(mediaStream.getVideoTracks()[0]);
    }

    return {
        startStreaming,
        stopStreaming,
        updateAudioTrack: updateAudioSource,
        updateVideoTrack: updateVideoSource,
        publisherState
    };
};

export default usePublisher;