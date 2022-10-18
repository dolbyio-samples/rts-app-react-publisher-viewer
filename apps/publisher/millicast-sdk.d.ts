declare namespace millicast {
    interface BroadcastOptions {
        mediaStream: MediaStream | MediaStreamTrack[]
    }
    interface DirectorResponse {
        urls: string[],
        jwt: string,
        iceServers: RTCIceServer[]
    }
    type tokenGeneratorCallback = () => Promise<DirectorResponse>
    type EventEmitter = import('events').EventEmitter
    class Publish {
        constructor(streamName: string, tokenGenerator: tokenGeneratorCallback, autoReconnect: boolean = true)
        connect(options: BroadcastOptions): Promise<void>
        stop()
        isActive(): boolean
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Publish extends EventEmitter {}
    class Director {
        static getPublisher({token: string, streamName: string}): Promise<DirectorResponse>
    }
}

declare module '@millicast/sdk' {
    export = millicast
}