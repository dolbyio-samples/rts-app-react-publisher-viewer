import { useEffect, useRef, useState } from "react";
import { Director, Publish, Event } from '@millicast/sdk';

export type PublisherState = "ready" | "connecting" | "streaming";

export interface Publisher {
    startStreaming: (broadcastOptions: BroadcastOptions) => Promise<void>;
    stopStreaming: () => void;
    updateAudioTrack: (track: MediaStreamTrack) => Promise<void>;
    updateVideoTrack: (track: MediaStreamTrack) => Promise<void>;
    publisherState: PublisherState;
    viewerCount: number;
    linkText: string;
}

export interface BroadcastOptions {
    mediaStream: MediaStream,
    // TODO The app only supports the `viewercount` event right now, and none others. Subsribing to other events
    // will not produce any results. 
    events: Event[]
}

const usePublisher = (token: string, streamName: string, streamId: string): Publisher => {

    const [publisherState, setPublisherState] = useState<PublisherState>("ready");
    const [viewerCount, setViewerCount] = useState(0);

    const publisher = useRef<Publish>();

    useEffect(() => {
        if (!token || !streamName) return; 
        const tokenGenerator = () => Director.getPublisher({ token: token, streamName: streamName });
        publisher.current = new Publish(streamName, tokenGenerator, true);
        return () => { stopStreaming() };

    }, [token, streamName]);

    const startStreaming = async (broadcastOptions: BroadcastOptions) => {
        if (!publisher.current || publisher.current.isActive() || publisherState !== "ready") return;
        try {

            setPublisherState("connecting");
            await publisher.current.connect(broadcastOptions);

            publisher.current.on('broadcastEvent', (event) => {
                const { name, data } = event;
                if (broadcastOptions.events.includes(name)) setViewerCount(data.viewercount);
            });

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

    const linkText = `https://viewer.millicast.com/?streamId=${streamId}/${streamName}`;

    return {
        startStreaming,
        stopStreaming,
        updateAudioTrack,
        updateVideoTrack,
        publisherState,
        viewerCount,
        linkText
    };
};

export default usePublisher;
