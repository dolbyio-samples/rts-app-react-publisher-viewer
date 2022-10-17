export type PublisherState = "ready" | "connecting" | "streaming";

export interface Publisher {
    startStreaming: (mediaStream: MediaStream) => Promise<void>;
    stopStreaming: () => void;
    updateAudioSource: (mediaStream: MediaStream) => Promise<void>;
    updateVideoSource: (mediaStream: MediaStream) => Promise<void>;
    publisherState: PublisherState;
}