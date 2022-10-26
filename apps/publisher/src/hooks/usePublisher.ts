import { useEffect, useRef, useState } from "react";
import { Director, Publish, Event, PeerConnection } from '@millicast/sdk';

import type { streamStats } from '@millicast/sdk';

export type PublisherState = "ready" | "connecting" | "streaming";

export interface Publisher {
    startStreaming: (broadcastOptions: BroadcastOptions) => Promise<void>;
    stopStreaming: () => void;
    updateStreaming: (mediaStream: MediaStream) => void;
    codec: string;
    codecList: string[],
    updateCodec: (codec: string) => void;
    publisherState: PublisherState;
    viewerCount: number;
    linkText: string;
    statistic?: streamStats;
}

export interface BroadcastOptions {
    mediaStream: MediaStream,
    // TODO The app only supports the `viewercount` event right now, and none others. Subsribing to other events
    // will not produce any results. 
    events: Event[],
    simulcast: boolean,
    codec: string
}

const usePublisher = (token: string, streamName: string, streamId: string): Publisher => {
    const [publisherState, setPublisherState] = useState<PublisherState>("ready");
    const [viewerCount, setViewerCount] = useState(0);
    const [statistic, setStatistic] = useState<streamStats>()

    const [codec, setCodec] = useState<string>("")
    const [codecList, setCodecList] = useState<string[]>([]);

    const publisher = useRef<Publish>();

    useEffect(() => {
        if (!token || !streamName) return;
        const tokenGenerator = () => Director.getPublisher({ token: token, streamName: streamName });
        publisher.current = new Publish(streamName, tokenGenerator, true);
        return () => { stopStreaming() };

    }, [token, streamName]);

    useEffect(() => {
        const capabilities = PeerConnection.getCapabilities('video');
        const supportedCodecs = capabilities.codecs.filter(item => item.codec.toLowerCase() !== "av1").map(item => item.codec);
        if (supportedCodecs.length === 0) return;
        setCodecList(supportedCodecs);
        setCodec(supportedCodecs[0]);
    }, []);

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
            publisher.current.webRTCPeer.initStats()

            publisher.current.webRTCPeer.on('stats', (statistic) => {
                setStatistic(statistic);
                console.log('Stats from event: ', statistic)
             })
        } catch (e) {
            setPublisherState("ready");
            console.error(e);
        }
    };

    const stopStreaming = async () => {
        await publisher.current?.stop();
        setPublisherState("ready")
        setStatistic(undefined)
    }

    const updateStreaming = (stream: MediaStream) => {
        if (publisher.current && publisher.current.isActive()) {
            const audioTracks = stream.getAudioTracks();
            if (audioTracks.length) {
                publisher.current.webRTCPeer.replaceTrack(audioTracks[0]);
            }
            const videoTracks = stream.getVideoTracks();
            if (videoTracks.length) {
                publisher.current.webRTCPeer.replaceTrack(videoTracks[0]);
            }
        }
    }

    const updateCodec = (codecValue: string) => {
        if (publisherState !== 'ready' && codecList != undefined && !codecList.includes(codecValue)) return;
        setCodec(codecValue);
    }

    const linkText = `https://viewer.millicast.com/?streamId=${streamId}/${streamName}`;

    return {
        startStreaming,
        stopStreaming,
        updateStreaming,
        codec,
        codecList,
        updateCodec,
        publisherState,
        viewerCount,
        linkText,
        statistic
    };
};

export default usePublisher;
