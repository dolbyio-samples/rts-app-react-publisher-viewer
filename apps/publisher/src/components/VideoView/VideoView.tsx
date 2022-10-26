import React, { memo, useRef, useEffect, useState } from "react";
import { Box, HStack, IconButton } from '@chakra-ui/react';

import FullScreen from '../Icons/FullScreen';
import FullScreenExit from "../Icons/FullScreenExit";
import Info from "../Icons/Info";

import StatisticInfo from '../StatisticInfo/StatisticInfo';
import type { streamStats } from '../../hooks/usePublisher';

type VideoViewProps = {
    mediaStream?: MediaStream;
    statistic?: streamStats;
}

const VideoView = ({mediaStream, statistic}: VideoViewProps) => {
    const video = useRef<HTMLVideoElement>(null);
    const fullScreenButton = useRef<HTMLButtonElement>(null);

    const [ isFullScreen, setIsFullScreen ] = useState(false);
    const [ showStatisticInfo, setshowStatisticInfo ] = useState(false);
    const [ isHoveredOnVideo, setIsHoveredOnVideo ] = useState(false);

    useEffect(() => {
        if (video.current && mediaStream) {
          video.current.srcObject = mediaStream;
        }
    }, [mediaStream]);

    const componentElementsStyle = { 
        '.video': { 
            transform: 'scaleX(-1)' 
        }, 
        '.video--fullscreen': { 
            width: '100vw', 
            height: '100vh', 
            overflowY: 'hidden'
        }, 
        '.icon-button': {
            padding: "10px",
            background: "transparent",
            borderRadius: "0",
            border: "1px solid transparent",
            width: "min-content",
        },
        '.icon-button--video-on-hover': {
            background: 'white',
            border: '1px solid black'
        },
        '.icon-button: hover': {
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
            >
            {/* eslint-disable-next-line react/no-unknown-property */}
            <video className={`video ${isFullScreen && 'video--fullscreen'}`} playsInline test-id="video-view" autoPlay ref={video} muted onMouseOver={() => setIsHoveredOnVideo(true)} onMouseOut={() => setIsHoveredOnVideo(false)}/>
            {showStatisticInfo && <StatisticInfo statistic={statistic} />}
            <HStack pos="absolute" bottom={isFullScreen ? ["120px", "120px", 0] : 0} right="0" spacing="0">
                <IconButton 
                    aria-label="Full screen" 
                    size="md"
                    className={`icon-button ${isHoveredOnVideo && "icon-button--video-on-hover"}`}
                    ref={fullScreenButton}
                    onClick={() => setIsFullScreen(!isFullScreen)}
                    icon={isFullScreen ? <FullScreenExit fill="black" /> : <FullScreen fill="black" />}
                    onMouseOver={() => setIsHoveredOnVideo(true)} 
                    onMouseOut={() => setIsHoveredOnVideo(false)}/>
                <IconButton 
                    aria-label="Stream Information" 
                    size="md"
                    className="icon-button"
                    onClick={() => setshowStatisticInfo(!showStatisticInfo)}
                    icon={<Info fill="black" />}/>
            </HStack>
        </Box>
    );
};

export default memo(VideoView);