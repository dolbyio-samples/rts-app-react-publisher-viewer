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

    const [ isFullScreen, setIsFullScreen ] = useState(false);
    const [ isHoveredOnVideo, setIsHoveredOnVideo ] = useState(false);

    useEffect(() => {
        if (video.current && mediaStream) {
          video.current.srcObject = mediaStream;
        }
    }, [mediaStream]);

    useEffect(() => {
        fullScreenButton.current?.classList.add('icon-button--hover')
        setTimeout(() => {
            fullScreenButton.current?.classList.remove('icon-button--hover');
        }, 2000)
    }, [])

    const componentElementsStyle = { 
        '.video': { 
            transform: 'scaleX(-1)' 
        }, 
        '.video--fullscreen': { 
            width: '100vw', 
            height: '100vh', 
            overflowY: 'hidden'
        }, 
        '.icon-button--default': {
            padding: "10px",
            background: "transparent",
            position: "absolute",
            right: "0",
            bottom: "0",
            borderRadius: "0",
            border: "1px solid transparent"
        },
        '.icon-button--hover': {
            background: 'white',
            border: '1px solid black'
        }
    }

    return (
        <Box 
            test-id="video-view-wrapper" 
            sx={componentElementsStyle} 
            pos={isFullScreen ? "fixed" : "relative"} 
            bg="black" 
            top="0" 
            right="0" 
            zIndex="1"
            onMouseOver={() => setIsHoveredOnVideo(true)} onMouseOut={() => setTimeout(() => {setIsHoveredOnVideo(false)}, 2000)}>
            {/* eslint-disable-next-line react/no-unknown-property */}
            <video className={`video ${isFullScreen && 'video--fullscreen'}`} playsInline test-id="video-view" autoPlay ref={video} muted />
            <IconButton 
                aria-label="Full screen" 
                size="md"
                className={`icon-button--default ${isHoveredOnVideo && "icon-button--hover"}`}
                _hover={componentElementsStyle[".icon-button--hover"]}
                ref={fullScreenButton}
                onClick={() => setIsFullScreen(!isFullScreen)}
                icon={isFullScreen ? <FullScreenExit fill="black" /> : <FullScreen fill="black" />}/>
        </Box>
    );
};

export default memo(VideoView);