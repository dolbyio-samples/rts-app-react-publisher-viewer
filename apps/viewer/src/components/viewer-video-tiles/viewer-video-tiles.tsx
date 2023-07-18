import { Box, Center, Flex, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import React, { useEffect, useMemo, useState } from 'react';

import { IconProfile } from '@millicast-react/dolbyio-icons';
import { SimulcastQuality } from '@millicast-react/use-viewer';

import usePlaybackControl from '../../hooks/use-playback-control';
import { ViewerVideoTilesProps } from './types';
import ViewerVideoView from './video-tile';

const MAX_SOURCES = 4;

const ViewerVideoTiles = ({
  mainMediaStream,
  mainQualityOptions,
  mainStatistics,
  projectToMainStream,
  remoteTrackSources,
  setSourceQuality,
}: ViewerVideoTilesProps) => {
  const viewerPlaybackControl = usePlaybackControl(Array.from(remoteTrackSources).map(([sourceId]) => sourceId));

  const [mainSourceId, setMainSourceId] = useState('');

  const isMobileBrowser =
    (typeof navigator !== 'undefined' && navigator.userAgent.match(/Android|iPhone|mobile/i)) ||
    /*
     * Apple tablets are faking userAgent by default to treat them as desktop browsers, additional check for Apple devices
     */
    (navigator?.platform === 'MacIntel' && 'maxTouchPoints' in navigator && navigator.maxTouchPoints > 0);

  const [isMobile, setIsMobile] = useState(false);
  const [isMobileSmall, setIsMobileSmall] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(!isMobileBrowser);

  // Assign the first source as the initial main stream
  useEffect(() => {
    if (remoteTrackSources.size) {
      const srcArray = Array.from(remoteTrackSources);
      const newSrcId = srcArray[srcArray.length - 1][0];

      console.log('>>>>', isDesktop, newSrcId);
      if (remoteTrackSources.size == 1) {
        setMainSourceId(newSrcId);
        changeMainSource(newSrcId);
        return;
      }

      if (isDesktop && newSrcId.toLowerCase().includes('desktop')) {
        setMainSourceId(newSrcId);
        changeMainSource(newSrcId);
      }

      if (isTablet && newSrcId.toLowerCase().includes('tablet')) {
        setMainSourceId(newSrcId);
        changeMainSource(newSrcId);
      }

      if (isMobile && newSrcId.toLowerCase().includes('mobile')) {
        setMainSourceId(newSrcId);
        changeMainSource(newSrcId);
      }
    }
  }, [remoteTrackSources.size]);

  // Reset main stream when layers change
  useEffect(() => {
    if (mainSourceId === '') {
      return;
    }

    setSourceQuality(mainSourceId);
  }, [mainQualityOptions.length]);

  const changeMainSource = async (newMainSourceId: string) => {
    if (mainSourceId !== '') {
      projectToMainStream(mainSourceId, true);
    }

    projectToMainStream(newMainSourceId, true).then(() => {
      setMainSourceId(newMainSourceId);
      // Reset quality
      setSourceQuality(newMainSourceId, { streamQuality: 'Auto' });
    });
  };

  const mainSourceSettings = useMemo(() => {
    if (mainSourceId === '') {
      return {};
    }

    const { quality } = remoteTrackSources.get(mainSourceId) ?? {};

    return {
      quality: {
        handleSelect: (data: unknown) => {
          setSourceQuality(mainSourceId, data as SimulcastQuality);
        },
        options: mainQualityOptions,
        value: quality ?? '',
      },
    };
  }, [mainQualityOptions, mainSourceId, remoteTrackSources]);

  const isStreaming = remoteTrackSources.size > 0;

  const breakpoints = {
    mobileSmall: 320,
    mobile: 600,
    tablet: 1024,
    desktop: 1440,
  };

  const handleDeviceType = () => {
    let mainDimension = window.innerWidth;

    if (window.innerWidth > window.innerHeight) {
      mainDimension = window.innerHeight;
    }
    if (window.innerWidth <= breakpoints.tablet || isMobileBrowser) {
      if (mainDimension <= breakpoints.mobileSmall) {
        setIsMobile(false);
        setIsMobileSmall(true);
        setIsTablet(false);
        setIsDesktop(false);
      } else if (mainDimension <= breakpoints.mobile) {
        setIsMobile(true);
        setIsMobileSmall(false);
        setIsTablet(false);
        setIsDesktop(false);
      } else if (mainDimension <= breakpoints.tablet || isMobileBrowser) {
        setIsMobile(false);
        setIsMobileSmall(false);
        setIsTablet(true);
        setIsDesktop(false);
      }
    } else {
      setIsMobile(false);
      setIsMobileSmall(false);
      setIsTablet(false);
      setIsDesktop(true);
    }
  };

  useEffect(() => {
    handleDeviceType();
  }, []);

  return (
    <Flex alignItems="center" flex={1} justifyContent="center" width="100%">
      {!isStreaming || mainSourceId === '' ? (
        <VStack>
          <Heading as="h2" fontSize="24px" fontWeight="600" test-id="pageHeader">
            Stream is not live
          </Heading>
          <Text test-id="pageDesc">Please wait for livestream to begin.</Text>
        </VStack>
      ) : (
        <HStack height="573px" justifyContent="center" maxHeight="573px" width="100vw">
          <Box height="100%" maxWidth="90vw" test-id="rtsVideoMain" width="80vw">
            <ViewerVideoView
              controls={viewerPlaybackControl[mainSourceId]}
              isStreaming={isStreaming}
              settings={mainSourceSettings}
              showControlBar
              statistics={mainStatistics}
              videoProps={{
                displayVideo: true,
                label: mainSourceId,
                mediaStream: mainMediaStream,
                placeholderNode: (
                  <Center
                    background="dolbyNeutral.800"
                    color="dolbyNeutral.700"
                    height="100%"
                    position="absolute"
                    width="100%"
                  >
                    <IconProfile height="174px" width="174px" />
                  </Center>
                ),
              }}
            />
          </Box>
        </HStack>
      )}
    </Flex>
  );
};

export default ViewerVideoTiles;
