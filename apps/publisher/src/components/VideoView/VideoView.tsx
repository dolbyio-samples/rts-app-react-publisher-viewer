import React, { memo, useRef, useEffect, useState } from "react";
import { Box, IconButton } from '@chakra-ui/react';
import FullScreen from '../Icons/FullScreen';
import FullScreenExit from "../Icons/FullScreenExit";

type VideoViewProps = {
    mediaStream?: MediaStream;
}

const VideoView = ({mediaStream}: VideoViewProps) => {
    const video = useRef<HTMLVideoElement>(null);
    const fullScreenButton = useRef<HTMLButtonElement>(null);

    const [ isFullScreenOn, setFullScreenStatus ] = useState(false);
    const [ videoIsHovered, setVideoHoverStatus ] = useState(false);

    useEffect(() => {
        if (video.current && mediaStream) {
          video.current.srcObject = mediaStream;
        }
    }, [mediaStream]);

    useEffect(() => {
        fullScreenButton.current?.classList.add('icon-button--on')
        setTimeout(() => {
            fullScreenButton.current?.classList.remove('icon-button--on');
        }, 2000)
    }, [])

    const VideoViewWrapper = (isFullScreenOn: boolean) => {
        if (isFullScreenOn) {
            return "absolute";
        }

        return "relative";
    }

    return (
        <Box 
            test-id="video-view-wrapper" 
            sx={{ '.video': { transform: 'scaleX(-1)' }, '.video--fullscreen': { width: '100vw', height: '100vh', overflowY: 'hidden'}, '.icon-button--on': {background: 'white', border: '1px solid black'}}} 
            pos={VideoViewWrapper(isFullScreenOn)} 
            bg="black" 
            top="0" 
            right="0" 
            zIndex="1">
            {/* eslint-disable-next-line react/no-unknown-property */}
            <video className={`video ${isFullScreenOn && 'video--fullscreen'}`} playsInline test-id="video-view" autoPlay ref={video} muted onMouseMove={() => setVideoHoverStatus(true)} onMouseOut={() => setVideoHoverStatus(false)}/>
            <IconButton 
                aria-label="Full screen" 
                p="10px" 
                size="md"
                bg="transparent" 
                pos="absolute" 
                right="0" 
                bottom="0" 
                borderRadius="0"
                border="1px solid transparent"
                className={`${videoIsHovered && "icon-button--on"}`}
                _hover={{bg: 'white', border: '1px solid black'}}
                ref={fullScreenButton}
                onClick={() => setFullScreenStatus(!isFullScreenOn)}
                icon={isFullScreenOn ? <FullScreenExit fill="black" /> : <FullScreen fill="black" />}/>
        </Box>
    );
};

export default memo(VideoView);