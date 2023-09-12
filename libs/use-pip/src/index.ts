import { useState } from 'react';

const usePip = () => {
    const [pipMode, setPipMode] = useState(false);

    const togglePipMode = (video: HTMLVideoElement) => {
        if (document.pictureInPictureElement) {
            document.exitPictureInPicture();
            setPipMode(false);
        } else if (document.pictureInPictureEnabled) {
            video.requestPictureInPicture();
            setPipMode(true);
        }
    };
    return {
        pipMode,
        togglePipMode
    }
};

export default usePip;