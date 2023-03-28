import { Center, Flex, Heading, Text, VStack, Wrap, WrapItem } from '@chakra-ui/react';
import { VideoCodec } from '@millicast/sdk';
import React, { useMemo } from 'react';

import { IconProfile } from '@millicast-react/dolbyio-icons';
import { bitrateList } from '@millicast-react/use-publisher';

import VideoTile from './video-tile';
import { Resolution, StreamTypes } from '../../hooks/use-multi-media-streams';
import { PublisherVideoTilesProps } from './types';

const PublisherVideoTiles = ({
  allSourcesLive,
  applyConstraints,
  codecList,
  onRemoveSource: handleRemoveSource,
  onStartSource: handleStartSource,
  onStopSource: handleStopSource,
  sources,
  streams,
  updateSourceBroadcastOptions,
  updateSourceMediaStream,
}: PublisherVideoTilesProps) => {
  const handleSrcMediaStreamReady = (id: string) => (mediaStream: MediaStream) => {
    // Only update if it doesn't already have a mediastream
    if (!sources.get(id)?.broadcastOptions.mediaStream) {
      updateSourceMediaStream(id, mediaStream);

      if (allSourcesLive) {
        handleStartSource(id, mediaStream)?.();
      }
    }
  };

  const settings = (id: string) => {
    const stream = streams.get(id);
    const source = sources.get(id);

    if (!stream || !source) {
      return {};
    }

    const { resolutions, type } = stream;
    const {
      broadcastOptions: { bandwidth: bitrate, codec, mediaStream, simulcast, sourceId: label },
      state,
    } = source;

    const codecListSimulcast = simulcast ? codecList.filter((item) => item !== 'vp9') : codecList;

    const isConnecting = state === 'connecting';
    const isReady = state === 'ready';
    const isStreaming = state === 'streaming';

    const { height, width } = mediaStream?.getVideoTracks()[0].getSettings() ?? {};
    const resolution = height && width ? `${width}x${height}` : '';

    return {
      bitrate: {
        handleSelect: (data: unknown) => updateSourceBroadcastOptions(id, { bandwidth: data as number }),
        isDisabled: isConnecting,
        isHidden: !bitrateList.length,
        options: bitrateList,
        value: bitrateList.find(({ value }) => value === bitrate)?.name ?? bitrateList[0].name,
      },
      codec: {
        handleSelect: (data: unknown) => updateSourceBroadcastOptions(id, { codec: data as VideoCodec }),
        isDisabled: !isReady,
        isHidden: isStreaming || !codecList.length,
        options: codecListSimulcast,
        value: codec ?? codecList[0],
      },
      name: {
        handleChange: (data: unknown) => updateSourceBroadcastOptions(id, { sourceId: data as string }),
        isDisabled: !isReady,
        isHidden: isStreaming,
        value: label,
      },
      resolution: {
        handleSelect: async (data: unknown) =>
          await applyConstraints(id, {
            videoConstraints: { height: (data as Resolution).height, width: (data as Resolution).width },
          }),
        isDisabled: type !== StreamTypes.MEDIA || isConnecting,
        isHidden: type !== StreamTypes.MEDIA,
        options: resolutions ?? [],
        value: resolution,
      },
      simulcast: {
        handleToggle: () => updateSourceBroadcastOptions(id, { simulcast: !simulcast }),
        isDisabled: !isReady,
        isHidden: isStreaming || codec === 'vp9',
        value: !!simulcast,
      },
    };
  };

  const [maxHeight, maxWidth] = useMemo(() => {
    switch (streams.size) {
      case 1:
        return ['564px', '1035px'];
      case 2:
        return ['382px', '688px'];
      default:
        return ['282px', '508px'];
    }
  }, [streams.size]);

  return (
    <Flex alignItems="center" flex={1} justifyContent="center" width="100%">
      {!sources.size ? (
        <VStack>
          <Heading as="h2" fontSize="24px" fontWeight="600" test-id="pageHeader">
            Get started
          </Heading>
          <Text test-id="pageDesc">Setup your audio and video before going live.</Text>
        </VStack>
      ) : (
        <Wrap justify="center" margin="0 auto" maxWidth="1388px" spacing="12px" width="100%">
          {Array.from(sources).map(([id, source]) => {
            const {
              broadcastOptions: { sourceId: label, mediaStream },
              state,
              statistics,
            } = source;
            const { objectUrl, type } = streams.get(id) ?? {};

            const flexBasis = streams.size > 1 ? 'calc(50% - 12px)' : '100%';
            const testId = `rtsVideo${type ? type[0].toUpperCase() + type.slice(1).toLowerCase() : 'Unknown'}`;

            // Kill if device is disconnected, screenshare has stopped, etc
            mediaStream?.getTracks().forEach((track) => {
              track.addEventListener('ended', () => {
                handleRemoveSource(id)?.();
              });
            });

            return (
              <WrapItem flexBasis={flexBasis} key={id} maxHeight={maxHeight} maxWidth={maxWidth} test-id={testId}>
                <VideoTile
                  canTogglePlayback={type === StreamTypes.LOCAL}
                  isConnecting={state === 'connecting'}
                  isStreaming={state === 'streaming'}
                  onRemove={handleRemoveSource(id)}
                  onStartLive={handleStartSource(id)}
                  onStopLive={handleStopSource(id)}
                  settings={settings(id)}
                  statistics={statistics}
                  streamType={type}
                  videoProps={{
                    label,
                    mediaStream,
                    mirrored: type === StreamTypes.MEDIA,
                    onSrcMediaStreamReady: objectUrl ? handleSrcMediaStreamReady(id) : undefined,
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
                    showDotIndicator: state === 'streaming',
                    src: objectUrl,
                  }}
                />
              </WrapItem>
            );
          })}
        </Wrap>
      )}
    </Flex>
  );
};

export default PublisherVideoTiles;
