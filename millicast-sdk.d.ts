declare namespace millicast {
  type Event = 'active' | 'inactive' | 'stopped' | 'vad' | 'layers' | 'migrate' | 'viewercount';
  type ViewEvent = 'active' | 'inactive' | 'vad' | 'layers' | 'viewercount';
  type CapabilityKind = 'audio' | 'video';
  type VideoCodec = 'av1' | 'h264' | 'vp8' | 'vp9';

  interface Capabilities {
    /**
     * - Only for audio, the number of audio channels supported.
     */
    channels?: number;
    codecs: Array<CodecInfo>;
    /**
     * - An array specifying the URI of the header extension, as described in RFC 5285.
     */
    headerExtensions: Array<RTCRtpHeaderExtensionCapability>;
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
  }

  interface BroadcastOptions {
    bandwidth?: number;
    codec?: VideoCodec;
    events?: Event[];
    mediaStream: MediaStream;
    simulcast?: boolean;
    sourceId: string; // bitrate restriction, 0 means unlimited
  }

  interface CodecInfo {
    codec: VideoCodec;
    mimetype: string;
  }

  interface ViewerCount {
    viewercount: number;
  }

  interface MediaTrackInfo {
    media: 'audio' | 'video';
    trackId: string;
  }
  interface MediaStreamSource {
    sourceId: string;
    readonly streamId: string;
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
    bitrate: number;
    id: string;
    layers: LayerInfo[];
    simulcastIdx: number;
  }

  interface LayerInfo {
    // map to 'id' in Medialayer
    bitrate?: number;
    encodingId: string;
    simulcastIdx?: number;
    spatialLayerId?: number;
    temporalLayerId?: number;
  }

  interface BroadcastEvent {
    data: string | Date | ViewerCount | MediaStreamSource | MediaStreamLayers;
    name: Event;
    type: string;
  }

  type TokenGeneratorCallback = () => Promise<DirectorResponse>;

  type EventEmitter = import('events').EventEmitter;

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Publish extends EventEmitter {}
  class Publish {
    constructor(streamName: string, tokenGenerator: TokenGeneratorCallback, autoReconnect: boolean);
    connect(options: BroadcastOptions): Promise<void>;
    isActive(): boolean;
    stop(): void;
    webRTCPeer: PeerConnection | undefined;
  }

  interface StreamAudioOutboundsStats {
    bitrate: number;
    id: string;
    mid: string;
    mimeType: string;
    timestamp: number;
    totalBytesSent: number;
  }

  interface StreamAudioInboundsStats {
    bitrate: number;
    id: string;
    jitter: number;
    mid: string;
    mimeType: string;
    packetsLostDeltaPerSecond: number;
    packetsLostRatioPerSecond: number;
    timestamp: number;
    totalBytesReceived: number;
    totalPacketsLost: number;
    totalPacketsReceived: number;
  }

  interface StreamAudioStats {
    inbounds?: StreamAudioInboundsStats[];
    outbounds?: StreamAudioOutboundsStats[];
  }

  interface StreamVideoOutboundsStats {
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
  }

  interface StreamVideoInboundsStats {
    bitrate: number;
    frameHeight: number;
    frameWidth: number;
    framesPerSecond?: number;
    id: string;
    jitter: number;
    mid: string;
    mimeType: string;
    packetsLostDeltaPerSecond: number;
    packetsLostRatioPerSecond: number;
    timestamp: number;
    totalBytesReceived: number;
    totalPacketsLost: number;
    totalPacketsReceived: number;
  }

  interface StreamVideoStats {
    inbounds?: StreamVideoInboundsStats[];
    outbounds?: StreamVideoOutboundsStats[];
  }

  interface StreamStats {
    audio: StreamAudioStats;
    availableOutgoingBitrate?: number;
    candidateType?: string;
    currentRoundTripTime?: number;
    raw?: {
      size: number;
    };
    totalRoundTripTime?: number;
    video: StreamVideoStats;
  }

  interface DirectorResponse {
    iceServers: RTCIceServer[];
    jwt: string;
    urls: string[];
  }

  interface DirectorPublisherOptions {
    streamName: string;
    token: string;
  }

  interface DirectorSubscriberOptions {
    streamAccountId: string;
    streamName: string;
    subscriberToken?: string;
  }
  class Director {
    static getPublisher(options: DirectorPublisherOptions): Promise<DirectorResponse>;
    static getSubscriber(options: DirectorSubscriberOptions): Promise<DirectorResponse>;
  }

  interface ViewProjectSourceMapping {
    media?: string;
    mediaId?: string;
    trackId?: string;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface View extends EventEmitter {}
  class View {
    constructor(streamName: string, tokenGenerator: TokenGeneratorCallback);
    addRemoteTrack(mediaType: 'audio' | 'video', streams: MediaStream[]): Promise<RTCRtpTransceiver>;
    connect(options?: ViewOptions): Promise<void>;
    isActive(): boolean;
    project(sourceId?: string, mapping?: ViewProjectSourceMapping[]): Promise<void>;
    reconnect();
    select(layer: LayerInfo | unknown): Promise<void>;
    stop(): void;
    unproject(mediaIds: string[]): Promise<void>;
    webRTCPeer: PeerConnection | undefined;
  }

  interface ViewOptions {
    // Id of the main source that will be received by the default MediaStream
    events?: Event[];
    pinnedSourceId?: string; // Override which events will be delivered by the server (any of "active" | "inactive" | "vad" | "layers" | "viewercount")
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
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
     * Get sender tracks
     * @returns {Array<MediaStreamTrack>} An array with all tracks in sender peer.
     */
    getTracks(): MediaStreamTrack[];
    initStats(): void;
    on: (event: string, listener: (stats: StreamStats) => void) => void;
    /**
     * Replace current audio or video track that is being broadcasted.
     * @param {MediaStreamTrack} mediaStreamTrack - New audio or video track to replace the current one.
     */
    replaceTrack(mediaStreamTrack: MediaStreamTrack): void;
    stopStats(): void;
    /**
     * Set SDP information to remote peer with bandwidth restriction.
     * @param {Number} bitrate - New bitrate value in kbps or 0 unlimited bitrate.
     * @returns {Promise<void>} Promise object which resolves when bitrate was successfully updated.
     */
    updateBitrate(bitrate?: number): Promise<void>;

    static getCapabilities(kind: CapabilityKind): Capabilities;
  }

  interface LogLevel {
    name: string;
    value: number;
  }

  interface Logger {
    // TODO: add methods for instance here
    getHistory(): string[];
  }
  class Logger {
    static get(name: string): Logger;
    static getHistory(): string[];
    static getLevel(): LogLevel;
    static setLevel(level: LogLevel): void;
    static get DEBUG(): LogLevel;
    static get ERROR(): LogLevel;
    static get INFO(): LogLevel;
    static get OFF(): LogLevel;
    static get TIME(): LogLevel;
    static get TRACE(): LogLevel;
    static get WARN(): LogLevel;
  }
}

declare module '@millicast/sdk' {
  export = millicast;
}
