import { Box, Center, Flex, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import React, { useEffect, useMemo } from 'react';

import { IconProfile } from '@millicast-react/dolbyio-icons';
import { SimulcastQuality } from '@millicast-react/use-viewer';

import usePlaybackControl from '../../hooks/use-playback-control';
import { ViewerVideoTilesProps } from './types';
import ViewerVideoView from './video-tile';

const MAX_SOURCES = 4;

const ViewerVideoTiles = ({
  mainMediaStream,
  mainSourceId,
  mainQualityOptions,
  mainStatistics,
  projectToMainStream,
  remoteTrackSources,
  setSourceQuality,
}: ViewerVideoTilesProps) => {
  const viewerPlaybackControl = usePlaybackControl(Array.from(remoteTrackSources).map(([sourceId]) => sourceId));

  // Reset main stream when layers change
  useEffect(() => {
    if (mainQualityOptions.length) {
      setSourceQuality(mainSourceId);
    }
  }, [mainQualityOptions.length]);

  const mainSourceSettings = useMemo(() => {
    const { quality } = remoteTrackSources.get(mainSourceId) ?? {};

    return {
      quality: {
        handleSelect: (data: unknown) => {
          setSourceQuality(mainSourceId, data as SimulcastQuality);
        },
        options: mainQualityOptions,
        value: quality ?? 'Auto',
      },
    };
  }, [mainQualityOptions, mainSourceId, remoteTrackSources]);

  const isStreaming = remoteTrackSources.size > 0;

  return (
    <Flex alignItems="center" flex={1} justifyContent="center" width="100%">
      {!isStreaming ? (
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
          {remoteTrackSources.size > 1 ? (
            <VStack height="100%" maxWidth="20vw">
              {Array.from(remoteTrackSources)
                .filter(([sourceId]) => sourceId !== mainSourceId)
                .map(([sourceId, { mediaStream }]) => (
                  <Box
                    cursor="pointer"
                    height={`calc(100% / (${MAX_SOURCES} - 1))`}
                    key={sourceId}
                    onClick={() => {
                      projectToMainStream(sourceId);
                    }}
                    test-id="rtsVideo"
                    width="100%"
                  >
                    <ViewerVideoView
                      controls={viewerPlaybackControl[sourceId]}
                      isStreaming={isStreaming}
                      videoProps={{
                        displayVideo: true,
                        label: sourceId,
                        mediaStream,
                        muted: true,
                      }}
                    />
                  </Box>
                ))}
            </VStack>
          ) : undefined}
        </HStack>
      )}
    </Flex>
  );
};

export default ViewerVideoTiles;
