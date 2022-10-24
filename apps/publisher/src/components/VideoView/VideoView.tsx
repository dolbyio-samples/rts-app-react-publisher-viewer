import React, { memo, useRef, useEffect, useState } from "react";
import { Box, IconButton } from '@chakra-ui/react';
import FullScreen from '../Icons/FullScreen';
import FullScreenExit from "../Icons/FullScreenExit";

type VideoViewProps = {
    mediaStream?: MediaStream;
}

const VideoView = ({mediaStream}: VideoViewProps) => {
    const video = useRef<HTMLVideoElement>(null);

    const [ isFullScreenOn, setFullScreenStatus ] = useState(false);

    useEffect(() => {
        if (video.current && mediaStream) {
          video.current.srcObject = mediaStream;
        }
    }, [mediaStream]);

    return (
        <Box test-id="video-view-wrapper" sx={{ '.video': { transform: 'scaleX(-1)' }, '.video--fullscreen': { width: '100vw', height: '100vh', overflowY: 'hidden'}}} pos="relative">
            {/* eslint-disable-next-line react/no-unknown-property */}
            <video className={`video ${isFullScreenOn && 'video--fullscreen'}`} playsInline test-id="video-view" autoPlay ref={video} muted />
            <IconButton 
                aria-label="Full screen" 
                p="10px" 
                size="md"
                bg="transparent" 
                pos="absolute" 
                right="0" 
                bottom="0" 
                borderRadius="0"
                _hover={{bg: 'white', border: '1px solid black'}}
                onClick={() => setFullScreenStatus(!isFullScreenOn)}
                icon={isFullScreenOn ? <FullScreenExit fill="black" /> : <FullScreen fill="black" />}/>
        </Box>
    );
};

export default memo(VideoView);