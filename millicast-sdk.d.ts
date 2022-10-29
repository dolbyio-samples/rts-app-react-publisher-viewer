declare namespace millicast {
  type Event = 'active' | 'inactive' | 'viewercount';

  type CapabilityKind = 'audio' | 'video';

  interface Capabilities {
    codecs: Array<CodecInfo>;
    /**
     * - Audio or video codec name.
     */
    codec: string;
    /**
     * - Audio or video codec mime type.
     */
    mimeType: string;
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
    codec?: string
  }

  interface CodecInfo {
    codec: string;
    mimetype: string;
  }

  interface BroadcastEvent {
    type: string;
    name:
    | "active"
    | "inactive"
    | "stopped"
    | "vad"
    | "layers"
    | "migrate"
    | "viewercount";
    data: string | Date | unknown;
  }
  interface DirectorResponse {
    urls: string[];
    jwt: string;
    iceServers: RTCIceServer[];
  }
  type tokenGeneratorCallback = () => Promise<DirectorResponse>;
  type EventEmitter = import("events").EventEmitter;
  class Publish {
    constructor(
      streamName: string,
      tokenGenerator: tokenGeneratorCallback,
      autoReconnect: boolean
    );
    connect(options: BroadcastOptions): Promise<void>;
    stop(): void;
    isActive(): boolean;
    webRTCPeer: PeerConnection;
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Publish extends EventEmitter { }
  interface DirectorPublisherOptions {
    token: string;
    streamName: string;
  }

  type streamAudioOutboundsStatus = {
    bitrate: number;
    id: string;
    mid: string;
    mimeType: string;
    timestamp: number;
    totalBytesSent: number;
  }

  type streamAudioStats = {
    inbounds: [];
    outbounds: streamAudioOutboundsStatus[];
  }

  type streamVideoOutboundsStatus = {
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

  type streamVideoStatus = {
    inbounds: [];
    outbounds: streamVideoOutboundsStatus[];
  }

  type streamStats = {
    audio: streamAudioStats,
    availableOutgoingBitrate: number;
    candidateType: string;
    currentRoundTripTime: number;
    raw: {
      size: number;
    };
    totalRoundTripTime: number;
    video: streamVideoStatus
  }
  class Director {
    static getPublisher(options: DirectorPublisherOptions): Promise<DirectorResponse>;
  }



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
    initStats: () => void;
    on: (event: string, listener: (stats: streamStats) => void) => void;

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

declare module "@millicast/sdk" {
  export = millicast;
}
