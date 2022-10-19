import { useEffect, useRef, useState } from "react";
import { Director, Publish } from '@millicast/sdk';

export type PublisherState = "ready" | "connecting" | "streaming";

export interface Publisher {
    startStreaming: (broadcastOptions: BroadcastOptions) => Promise<void>;
    stopStreaming: () => void;
    updateAudioTrack: (track: MediaStreamTrack) => Promise<void>;
    updateVideoTrack: (track: MediaStreamTrack) => Promise<void>;
    publisherState: PublisherState;
}

export interface BroadcastOptions {
    mediaStream: MediaStream
}

const usePublisher = (token: string, streamName: string): Publisher => {

    const [publisherState, setPublisherState] = useState<PublisherState>("ready");
    const publisher = useRef<Publish>();

    useEffect(() => {
        if (!token || !streamName) return; 
        const tokenGenerator = () => Director.getPublisher({ token: token, streamName: streamName });
        publisher.current = new Publish(streamName, tokenGenerator, true);

        return () => { stopStreaming() };
    }, [token, streamName]);

    // TODO, this param list can grow significantly when we add the broadcast settings option, but until such time this list will stay small
    const startStreaming = async (broadcastOptions: BroadcastOptions) => {
        if (!publisher.current || publisher.current.isActive() || publisherState !== "ready") return;
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
        await publisher.current?.stop();
        setPublisherState("ready")
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const updateAudioTrack = async (track: MediaStreamTrack) => {
        // TODO yet to be tested
        // if (!publisher.current || publisher.current.isActive()) return;
        // await publisher.current.webRTCPeer.replaceTrack(mediaStream.getAudioTracks()[0]);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const updateVideoTrack = async (track: MediaStreamTrack) => {
        // TODO yet to be tested
        // if (!publisher.current || publisher.current.isActive()) return;
        // await publisher.current.webRTCPeer.replaceTrack(mediaStream.getVideoTracks()[0]);
    }

    return {
        startStreaming,
        stopStreaming,
        updateAudioTrack,
        updateVideoTrack,
        publisherState
    };
};

export default usePublisher;
