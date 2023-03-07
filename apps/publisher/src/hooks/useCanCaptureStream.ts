import { useEffect, useState } from 'react';

/**
 * Determine if HTMLMediaElement.captureStream is supported on the current browser
 */
const useCanCaptureStream = () => {
  const [canCaptureStream, setCanCaptureStream] = useState(false);

  useEffect(() => {
    const video = document.createElement('video') as HTMLVideoElement & {
      captureStream?: (frameRequestRate?: number) => MediaStream;
    };

    if (video.captureStream) {
      setCanCaptureStream(true);
    }
  }, []);

  return canCaptureStream;
};

export default useCanCaptureStream;
