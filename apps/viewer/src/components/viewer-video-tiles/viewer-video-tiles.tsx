import { Box, Center, HStack, Grid } from '@chakra-ui/react';
import React, { useEffect, useMemo } from 'react';

import { IconProfile } from '@millicast-react/dolbyio-icons';
import { SimulcastQuality } from '@millicast-react/use-viewer';

import usePlaybackControl from '../../hooks/use-playback-control';
import { ViewerVideoTilesProps } from './types';
import ViewerVideoView from './video-tile';
import { NoStream } from '../no-stream';
import { useURLParameters } from '../../utils';

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
  const { isMultiviewEnabled } = useURLParameters();

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
      sources: {
        handleSelect: (data: unknown) => {
          const { sourceId } = data as { sourceId: string };
          projectToMainStream(sourceId, true);
        },
        options: Array.from(remoteTrackSources).map(([sourceId]) => ({
          id: sourceId,
          label: sourceId,
          data: { sourceId },
        })),
        value: mainSourceId,
      },
    };
  }, [mainQualityOptions, mainSourceId, remoteTrackSources]);

  const isStreaming = remoteTrackSources.size > 0;

  if (!isStreaming) {
    return <NoStream />;
  }

  return (
    <HStack wrap="wrap" justifyContent="center">
      <Box test-id="rtsVideoMain" flex="2" height={{ sm: '50vh' }} width={{ sm: '80vw' }}>
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
      {isMultiviewEnabled && remoteTrackSources.size > 1 ? (
        <Grid
          gridTemplateColumns={{ base: '1fr 1fr', sm: '1fr' }}
          width={{ sm: '20vw' }}
          gridRowGap="15px"
          columnGap="15px"
          marginTop={{ base: '20px', sm: '0px' }}
        >
          {Array.from(remoteTrackSources)
            .filter(([sourceId]) => sourceId !== mainSourceId)
            .map(([sourceId, { mediaStream }]) => (
              <Box
                cursor="pointer"
                key={sourceId}
                onClick={() => {
                  projectToMainStream(sourceId, true);
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
        </Grid>
      ) : undefined}
    </HStack>
  );
};

export default ViewerVideoTiles;
