import React, { useEffect, useRef, useState } from "react";
import { Director, Publish } from '@millicast/sdk';
import type { Publisher, PublisherState } from './types/Publisher';


const usePublisher = (token: string, streamName: string): Publisher => {

    const [publisherState, setPublisherState] = useState<PublisherState>("ready");
    const publisher = useRef<Publish>();

    useEffect(() => {
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
            console.log(`Connecting with ${token} and ${streamName}`);
            setPublisherState("connecting");
            await publisher.current.connect(broadcastOptions);
            setPublisherState("streaming")
        } catch (e) {
            setPublisherState("ready");
            console.error(e);
        }
    };

    const stopStreaming = async () => {
        await publisher.current.stop();
        setPublisherState("ready")

    }

    // TODO yet to be properly tested
    const updateAudioSource = async (mediaStream: MediaStream) => {
        await publisher.current.webRTCPeer.replaceTrack(mediaStream.getAudioTracks()[0]);
    }

    // TODO yet to be properly tested
    const updateVideoSource = async (mediaStream: MediaStream) => {
        await publisher.current.webRTCPeer.replaceTrack(mediaStream.getVideoTracks()[0]);
    }

    return {
        startStreaming,
        stopStreaming,
        updateAudioSource,
        updateVideoSource,
        publisherState
    };
};

export default usePublisher;