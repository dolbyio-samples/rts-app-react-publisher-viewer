
declare namespace millicast {
  interface BroadcastOptions {
    mediaStream: MediaStream | MediaStreamTrack[];
  }

  interface BroadcastEvent {
    type: string;
    name: 'active' | 'inactive' | 'stopped' | 'vad' | 'layers' | 'migrate' | 'viewercount'
    data: string | Date | Array | unknown
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
      autoReconnect: boolean = true
    );
    connect(options: BroadcastOptions): Promise<void>;
    stop();
    isActive(): boolean;
    webRTCPeer: PeerConnection;
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Publish extends EventEmitter {}
  class Director {
    static getPublisher({
      token: string,
      streamName: string,
    }): Promise<DirectorResponse>;
  }

  /**
   * @class PeerConnection
   * @extends EventEmitter
   * @classdesc Manages WebRTC connection and SDP information between peers.
   * @example const peerConnection = new PeerConnection()
   * @constructor
   */
  declare class PeerConnection {

    /**
	 * Replace current audio or video track that is being broadcasted.
	 * @param {MediaStreamTrack} mediaStreamTrack - New audio or video track to replace the current one.
	 */
	replaceTrack(mediaStreamTrack: MediaStreamTrack): void;

    /**
	 * Set SDP information to remote peer with bandwidth restriction.
	 * @param {Number} bitrate - New bitrate value in kbps or 0 unlimited bitrate.
	 * @returns {Promise<void>} Promise object which resolves when bitrate was successfully updated.
	 */
	updateBitrate(bitrate?: number): Promise<void>;
  }

  declare type LogLevel = { 
    name: string,
    value: number
   }

  declare interface Logger {
    // TODO: add methods for instance here
    getHistory(): string[];
  }
  declare class Logger {
    static get(name: string): Logger
    static getHistory(): string[]
    static getLevel(): LogLevel
    static setLevel(level: LogLevel): void
    static get TRACE(): LogLevel
    static get DEBUG(): LogLevel
    static get INFO(): LogLevel
    static get TIME(): LogLevel
    static get WARN(): LogLevel
    static get ERROR(): LogLevel
    static get OFF(): LogLevel
  }
}

declare module "@millicast/sdk" {
  export = millicast;
}
