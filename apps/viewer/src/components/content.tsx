import { Center, VStack, Text, HStack, Flex, Spacer, Select } from '@chakra-ui/react';
import React, { useEffect, useRef } from 'react';
import useViewer, { StreamQuality } from '@millicast-react/use-viewer';
import VideoView from '@millicast-react/video-view';
import ParticipantCount from '@millicast-react/participant-count';
import LiveIndicator from '@millicast-react/live-indicator';

const Content = () => {
  const {
    viewerState,
    mainStream,
    setupViewer,
    stopViewer,
    startViewer,
    projectRemoteTrackToMain,
    remoteTrackSources,
    viewerCount,
    streamQualityOptions,
    updateStreamQuality,
    statistics,
  } = useViewer();

  const projectingSourceId = useRef<string>('main');

  useEffect(() => {
    const href = new URL(window.location.href);
    const streamName = href.searchParams.get('streamName') ?? import.meta.env.VITE_MILLICAST_STREAM_NAME;
    const streamAccountId = href.searchParams.get('streamAccountId') ?? import.meta.env.VITE_MILLICAST_STREAM_ID;
    setupViewer(streamName, streamAccountId, projectingSourceId.current);
    return stopViewer;
  }, []);

  const start = () => {
    if (viewerState === 'initial' || viewerState === 'ready') {
      startViewer({ events: ['active', 'inactive', 'layers', 'viewercount'] });
    }
  };

  useEffect(() => {
    const timer = setInterval(start, 3000);

    if (viewerState === 'liveOn' || viewerState === 'liveOff') {
      clearInterval(timer);
    }
    return () => clearTimeout(timer);
  }, [viewerState]);

  useEffect(() => {
    if (
      projectingSourceId.current &&
      remoteTrackSources.size > 0 &&
      !remoteTrackSources.get(projectingSourceId.current)
    ) {
      const newSourceId = remoteTrackSources.keys().next().value as string;
      projectRemoteTrackToMain(newSourceId);
    }
  }, [remoteTrackSources]);

  return (
    <VStack width="100vw" height="100vh">
      <Flex w="100%" pr="4">
        <Spacer />
        {viewerState === 'liveOn' && <LiveIndicator />}
      </Flex>
      <Flex w="100%" pr="4">
        <Spacer />
        {viewerState === 'liveOn' && <ParticipantCount count={viewerCount} />}
      </Flex>
      {(viewerState === 'ready' || viewerState === 'connecting') && (
        <Flex direction="column" width={'100vw'} height={'75vh'} alignContent={'center'} justifyContent={'center'}>
          <VStack>
            <Text fontSize={'2xl'}> Waiting room </Text>
            <Text fontSize={'md'}> Neque libero consequat malesuada ipsum id. (Temporary copy)</Text>
          </VStack>
        </Flex>
      )}
      <Center>
        <VStack>
          <HStack>
            {mainStream && viewerState === 'liveOn' && (
              <VideoView width="692px" height="384px" mediaStream={mainStream} statistics={statistics} />
            )}
            <HStack>
              {Array.from(remoteTrackSources, ([id, source]) => ({ id, source })).map((trackSource) => {
                return (
                  <VideoView
                    key={trackSource.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (projectingSourceId.current === trackSource.id) return;
                      projectingSourceId.current = trackSource.id;
                      projectRemoteTrackToMain(trackSource.id);
                    }}
                    width={'236px'}
                    height={'133px'}
                    mediaStream={trackSource.source.mediaStream}
                  />
                );
              })}
            </HStack>
          </HStack>
        </VStack>
        {viewerState === 'liveOn' && streamQualityOptions.length > 1 && (
          <Select
            test-id="simulcastQualitySelect"
            defaultValue={streamQualityOptions[0].streamQuality}
            onChange={(e) => updateStreamQuality(e.target.value as StreamQuality)}
          >
            {streamQualityOptions.map((option) => {
              return (
                <option key={option.streamQuality} value={option.streamQuality}>
                  {option.streamQuality}
                </option>
              );
            })}
            ;
          </Select>
        )}
        {viewerState === 'liveOff' && (
          <Flex direction="column" width={'100vw'} height={'75vh'} alignContent={'center'} justifyContent={'center'}>
            <Text> The show is over, folks!</Text>
          </Flex>
        )}
      </Center>
    </VStack>
  );
};

export default Content;
