import { useState } from 'react';

const usePip = () => {
    const [pipMode, setPipMode] = useState(false);

    const togglePipMode = (video: HTMLElement) => {
        if (document.pictureInPictureElement) {
            document.exitPictureInPicture();
            setPipMode(false);
        } else if (document.pictureInPictureEnabled) {
            (video as HTMLVideoElement).requestPictureInPicture();
            setPipMode(true);
        }
    };
    return {
        pipMode,
        togglePipMode
    }
};

export default usePip;