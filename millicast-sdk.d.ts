declare namespace millicast {

    declare interface BroadcastOptions {
        mediaStream: MediaStream | MediaStreamTrack[]
    }

    declare interface DirectorResponse {
        urls: string[],
        jwt: string,
        iceServers: RTCIceServer[]
    }

    declare type tokenGeneratorCallback = () => Promise<DirectorResponse>

    declare class Publish {
        constructor(streamName: string, tokenGenerator: tokenGeneratorCallback, autoReconnect: boolean = true)
        connect(options: BroadcastOptions): Promise<void>
        stop()
        isActive(): boolean
    }

    declare class Director {
        static getPublisher({token: string, streamName: string}): Promise<DirectorResponse>
    }
}

declare module '@millicast/sdk' {
    export = millicast
}