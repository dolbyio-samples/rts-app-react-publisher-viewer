declare namespace millicast {
  type Event = 'active' | 'inactive' | 'stopped' | 'vad' | 'layers' | 'migrate' | 'viewercount';
  type ViewEvent = 'active' | 'inactive' | 'vad' | 'layers' | 'viewercount';
  type CapabilityKind = 'audio' | 'video';
  type VideoCodec = 'VP8' | 'VP9' | 'H264' | 'AV1';

  interface Capabilities {
    codecs: Array<CodecInfo>;
    // /**
    //  * - Audio or video codec name.
    //  */
    // codec: VideoCodec;
    // /**
    //  * - Audio or video codec mime type.
    //  */
    // mimeType: string;
    /**
     * - In case of SVC support, a list of scalability modes supported.
     */
    scalabilityModes?: Array<string>;
    /**
     * - Only for audio, the number of audio channels supported.
     */
    channels?: number;
    /**
     * - An array specifying the URI of the header extension, as described in RFC 5285.
     */
    headerExtensions: Array<RTCRtpHeaderExtensionCapability>;
  }

  interface BroadcastOptions {
    mediaStream: MediaStream | MediaStreamTrack[];
    events?: Event[];
    sourceId?: string;
    simulcast?: boolean;
    codec?: VideoCodec;
    bandwidth?: number; // 0 means unlimited
  }

  interface CodecInfo {
    codec: VideoCodec;
    mimetype: string;
  }

  interface ViewerCount {
    viewercount: number;
  }

  interface MediaTrackInfo {
    trackId: string;
    media: 'audio' | 'video';
  }
  interface MediaStreamSource {
    readonly streamId: string;
    sourceId: string;
    readonly tracks: MediaTrackInfo[];
  }

  interface MediaStreamLayers {
    medias: Media[];
  }

  interface Media {
    active: MediaLayer[];
    inactive: MediaLayer[];
    layers: LayerInfo[];
  }

  interface MediaLayer {
    id: string;
    bitrate: number;
    simulcastIdx: number;
    layers: LayerInfo[];
  }

  interface LayerInfo {
    encodingId: string; // map to 'id' in Medialayer
    bitrate?: number;
    simulcastIdx?: number;
    spatialLayerId?: number;
    temporalLayerId?: number;
  }

  interface BroadcastEvent {
    type: string;
    name: Event;
    data: string | Date | ViewerCount | MediaStreamSource | MediaStreamLayers;
  }

  type TokenGeneratorCallback = () => Promise<DirectorResponse>;
  type EventEmitter = import('events').EventEmitter;
  class Publish {
    constructor(streamName: string, tokenGenerator: TokenGeneratorCallback, autoReconnect: boolean);
    connect(options: BroadcastOptions): Promise<void>;
    stop(): void;
    isActive(): boolean;
    webRTCPeer: PeerConnection | undefined;
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Publish extends EventEmitter {}

  type StreamAudioOutboundsStats = {
    bitrate: number;
    id: string;
    mid: string;
    mimeType: string;
    timestamp: number;
    totalBytesSent: number;
  };

  type StreamAudioInboundsStats = {
    bitrate: number;
    id: string;
    jitter: number;
    mid: string;
    mimeType: string;
    timestamp: number;
    packetsLostDeltaPerSecond: number;
    packetsLostRatioPerSecond: number;
    totalBytesReceived: number;
    totalPacketsReceived: number;
    totalPacketsLost: number;
  };

  type StreamAudioStats = {
    inbounds: StreamAudioInboundsStats[];
    outbounds: StreamAudioOutboundsStats[];
  };

  type StreamVideoOutboundsStats = {
    bitrate: number;
    frameHeight: number;
    frameWidth: number;
    framesPerSecond: number;
    id: string;
    mid: string;
    mimeType: string;
    qualityLimitationReason: string;
    timestamp: number;
    totalBytesSent: number;
  };

  type StreamVideoInboundsStats = {
    bitrate: number;
    frameHeight: number;
    frameWidth: number;
    framesPerSecond?: number;
    jitter: number;
    id: string;
    mid: string;
    mimeType: string;
    packetsLostDeltaPerSecond: number;
    packetsLostRatioPerSecond: number;
    totalBytesReceived: number;
    totalPacketsLost: number;
    totalPacketsReceived: number;
    timestamp: number;
  };

  type StreamVideoStats = {
    inbounds: StreamVideoInboundsStats[];
    outbounds: StreamVideoOutboundsStats[];
  };

  type StreamStats = {
    audio: StreamAudioStats;
    availableOutgoingBitrate?: number;
    candidateType?: string;
    currentRoundTripTime?: number;
    raw: {
      size: number;
    };
    totalRoundTripTime?: number;
    video: StreamVideoStats;
  };

  type DirectorResponse = {
    urls: string[];
    jwt: string;
    iceServers: RTCIceServer[];
  };

  type DirectorPublisherOptions = {
    token: string;
    streamName: string;
  };

  type DirectorSubscriberOptions = {
    streamName: string;
    streamAccountId: string;
    subscriberToken?: string;
  };
  class Director {
    static getPublisher(options: DirectorPublisherOptions): Promise<DirectorResponse>;
    static getSubscriber(options: DirectorSubscriberOptions): Promise<DirectorResponse>;
  }

  interface ViewProjectSourceMapping {
    trackId?: string;
    mediaId?: string;
    media?: string;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface View extends EventEmitter {}
  class View {
    constructor(streamName: string, tokenGenerator: TokenGeneratorCallback);
    stop(): void;
    isActive(): boolean;
    connect(options?: ViewOptions): Promise<void>;
    reconnect();
    project(sourceId?: string, mapping?: ViewProjectSourceMapping[]): Promise<void>;
    unproject(mediaIds: string[]): Promise<void>;
    addRemoteTrack(mediaType: 'audio' | 'video', streams: MediaStream[]): Promise<RTCRtpTransceiver>;
    select(layer: LayerInfo | unknown): Promise<void>;
    webRTCPeer: PeerConnection | undefined;
  }

  type ViewOptions = {
    pinnedSourceId?: string;
    events?: Event[];
  };

  interface PeerConnection extends EventEmitter {}
  /**
   * @class PeerConnection
   * @extends EventEmitter
   * @classdesc Manages WebRTC connection and SDP information between peers.
   * @example const peerConnection = new PeerConnection()
   * @constructor
   */
  class PeerConnection {
    /**
     * Replace current audio or video track that is being broadcasted.
     * @param {MediaStreamTrack} mediaStreamTrack - New audio or video track to replace the current one.
     */
    replaceTrack(mediaStreamTrack: MediaStreamTrack): void;
    initStats(): void;
    stopStats(): void;
    on: (event: string, listener: (stats: StreamStats) => void) => void;

    /**
     * Get sender tracks
     * @returns {Array<MediaStreamTrack>} An array with all tracks in sender peer.
     */
    getTracks(): MediaStreamTrack[];

    /**
     * Set SDP information to remote peer with bandwidth restriction.
     * @param {Number} bitrate - New bitrate value in kbps or 0 unlimited bitrate.
     * @returns {Promise<void>} Promise object which resolves when bitrate was successfully updated.
     */
    updateBitrate(bitrate?: number): Promise<void>;

    static getCapabilities(kind: CapabilityKind): Capabilities;
  }

  type LogLevel = {
    name: string;
    value: number;
  };

  interface Logger {
    // TODO: add methods for instance here
    getHistory(): string[];
  }
  class Logger {
    static get(name: string): Logger;
    static getHistory(): string[];
    static getLevel(): LogLevel;
    static setLevel(level: LogLevel): void;
    static get TRACE(): LogLevel;
    static get DEBUG(): LogLevel;
    static get INFO(): LogLevel;
    static get TIME(): LogLevel;
    static get WARN(): LogLevel;
    static get ERROR(): LogLevel;
    static get OFF(): LogLevel;
  }
}

declare module '@millicast/sdk' {
  export = millicast;
}
