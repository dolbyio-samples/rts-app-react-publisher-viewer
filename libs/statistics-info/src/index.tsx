import React, { memo } from 'react';
import type { StreamStats } from '@millicast/sdk';

import { VStack, Flex, Box, Text } from '@chakra-ui/react';

type StatisticsInfoProps = {
  statistics?: StreamStats;
};

const KILOBYTES = 1024;
const MEGABYTES = KILOBYTES * KILOBYTES;

const StatisticsInfo = ({ statistics }: StatisticsInfoProps) => {
  const formatTimestamp = (timestampMs: number | undefined): string => {
    if (!timestampMs) return '';

    const date = new Date(0);
    date.setUTCMilliseconds(timestampMs);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  const formatBytes = (bytes: number): string => {
    return `${formatNumber(bytes)}B`;
  };

  const formatBitRate = (bitRate: number): string => {
    return `${formatNumber(bitRate).toLowerCase()}bps`;
  };

  const formatNumber = (input: number): string => {
    if (input < KILOBYTES) return `${input}`;
    if (input >= KILOBYTES && input < MEGABYTES) return `${(input / KILOBYTES).toFixed(2)} K`;
    else return `${(input / MEGABYTES).toFixed(2)} M`;
  };

  return (
    <VStack test-id="statisticsInfo" color="white" spacing={1}>
      {statistics ? (
        <>
          <Flex w="100%">
            <Box flex="1">
              <Text fontSize="13px" fontWeight="600">
                Name
              </Text>
            </Box>
            <Box flex="1">
              <Text fontSize="13px" fontWeight="600">
                Value
              </Text>
            </Box>
          </Flex>
          {statistics.currentRoundTripTime && (
            <Flex w="100%">
              <Box flex="1">
                <Text fontSize="13px" color="dolbySecondary.200">
                  Current RTT:
                </Text>
              </Box>
              <Box flex="1">
                <Text fontSize="13px">{statistics.currentRoundTripTime * 1000} ms</Text>
              </Box>
            </Flex>
          )}
          {statistics.availableOutgoingBitrate &&
            statistics.audio?.outbounds.length > 0 &&
            statistics.video?.outbounds.length > 0 && (
              <Flex w="100%">
                <Box flex="1">
                  <Text fontSize="13px" color="dolbySecondary.200">
                    Available Outgoing Bitrate:
                  </Text>
                </Box>
                <Box flex="1">
                  <Text fontSize="13px">{formatBitRate(statistics.availableOutgoingBitrate)}</Text>
                </Box>
              </Flex>
            )}
          {statistics.candidateType && (
            <Flex w="100%">
              <Box flex="1">
                <Text fontSize="13px" color="dolbySecondary.200">
                  Candidate Type:
                </Text>
              </Box>
              <Box flex="1">
                <Text fontSize="13px">{statistics.candidateType}</Text>
              </Box>
            </Flex>
          )}
          <Flex w="100%">
            <Box flex="1">
              <Text fontSize="13px" color="dolbySecondary.200">
                Video Resolution:
              </Text>
            </Box>
            <Box flex="1">
              {statistics.video?.outbounds.length > 0 && (
                <Text fontSize="13px">
                  {statistics.video?.outbounds[0].frameWidth}x{statistics.video?.outbounds[0].frameHeight}
                </Text>
              )}
              {statistics.video?.inbounds.length > 0 && (
                <Text fontSize="13px">
                  {statistics.video?.inbounds[0].frameWidth}x{statistics.video?.inbounds[0].frameHeight}
                </Text>
              )}
            </Box>
          </Flex>
          {statistics.video?.outbounds.length > 0 && (
            <Flex w="100%">
              <Box flex="1">
                <Text fontSize="13px" color="dolbySecondary.200">
                  Quality Limitation Reason:
                </Text>
              </Box>
              <Box flex="1">
                <Text fontSize="13px">{statistics.video?.outbounds[0].qualityLimitationReason}</Text>
              </Box>
            </Flex>
          )}
          <Flex w="100%">
            <Box flex="1">
              <Text fontSize="13px" color="dolbySecondary.200">
                FPS:
              </Text>
            </Box>
            <Box flex="1">
              {statistics.video?.outbounds.length > 0 && (
                <Text fontSize="13px">{statistics.video?.outbounds[0].framesPerSecond}</Text>
              )}
              {statistics.video?.inbounds.length > 0 && (
                <Text fontSize="13px">{statistics.video?.inbounds[0].framesPerSecond}</Text>
              )}
            </Box>
          </Flex>
          <Flex w="100%">
            <Box flex="1">
              <Text fontSize="13px" color="dolbySecondary.200">
                Video Bitrate:
              </Text>
            </Box>
            <Box flex="1">
              {statistics.video?.outbounds.length > 0 && (
                <Text fontSize="13px">{formatBitRate(statistics.video?.outbounds[0].bitrate)}</Text>
              )}
              {statistics.video?.inbounds.length > 0 && (
                <Text fontSize="13px">{formatBitRate(statistics.video?.inbounds[0].bitrate)}</Text>
              )}
            </Box>
          </Flex>
          <Flex w="100%">
            <Box flex="1">
              <Text fontSize="13px" color="dolbySecondary.200">
                Audio Bitrate:
              </Text>
            </Box>
            <Box flex="1">
              {statistics.audio?.outbounds.length > 0 && (
                <Text fontSize="13px">{formatBitRate(statistics.audio?.outbounds[0].bitrate)}</Text>
              )}
              {statistics.audio?.inbounds.length > 0 && (
                <Text fontSize="13px">{formatBitRate(statistics.audio?.inbounds[0].bitrate)}</Text>
              )}
            </Box>
          </Flex>
          {statistics.video?.outbounds.length > 0 && (
            <Flex w="100%">
              <Box flex="1">
                <Text fontSize="13px" color="dolbySecondary.200">
                  Video Total Sent:
                </Text>
              </Box>
              <Box flex="1">
                <Text fontSize="13px">{formatBytes(statistics.video?.outbounds[0].totalBytesSent)}</Text>
              </Box>
            </Flex>
          )}
          {statistics.video?.inbounds.length > 0 && (
            <Flex w="100%">
              <Box flex="1">
                <Text fontSize="13px" color="dolbySecondary.200">
                  Video Total Received:
                </Text>
              </Box>
              <Box flex="1">
                <Text fontSize="13px">{formatBytes(statistics.video?.inbounds[0].totalBytesReceived)}</Text>
              </Box>
            </Flex>
          )}
          {statistics.audio?.outbounds.length > 0 && (
            <Flex w="100%">
              <Box flex="1">
                <Text fontSize="13px" color="dolbySecondary.200">
                  Audio Total Sent:
                </Text>
              </Box>
              <Box flex="1">
                <Text fontSize="13px">{formatBytes(statistics.audio?.outbounds[0].totalBytesSent)}</Text>
              </Box>
            </Flex>
          )}
          {statistics.video?.inbounds.length > 0 && (
            <Flex w="100%">
              <Box flex="1">
                <Text fontSize="13px" color="dolbySecondary.200">
                  Video Packet Loss:
                </Text>
              </Box>
              <Box flex="1">
                <Text fontSize="13px">{statistics.video.inbounds[0].totalPacketsLost}</Text>
              </Box>
            </Flex>
          )}
          {statistics.audio?.inbounds.length > 0 && (
            <Flex w="100%">
              <Box flex="1">
                <Text fontSize="13px" color="dolbySecondary.200">
                  Audio Packet Loss:
                </Text>
              </Box>
              <Box flex="1">
                <Text fontSize="13px">{statistics.audio.inbounds[0].totalPacketsLost}</Text>
              </Box>
            </Flex>
          )}
          {statistics.video?.inbounds.length > 0 && (
            <Flex w="100%">
              <Box flex="1">
                <Text fontSize="13px" color="dolbySecondary.200">
                  Video Packet Jitter:
                </Text>
              </Box>
              <Box flex="1">
                <Text fontSize="13px">{statistics.video.inbounds[0].jitter} ms</Text>
              </Box>
            </Flex>
          )}
          {statistics.audio?.inbounds.length > 0 && (
            <Flex w="100%">
              <Box flex="1">
                <Text fontSize="13px" color="dolbySecondary.200">
                  Audio Packet Jitter:
                </Text>
              </Box>
              <Box flex="1">
                <Text fontSize="13px">{statistics.audio.inbounds[0].jitter} ms</Text>
              </Box>
            </Flex>
          )}
          {statistics.audio?.inbounds.length > 0 && (
            <Flex w="100%">
              <Box flex="1">
                <Text fontSize="13px" color="dolbySecondary.200">
                  Audio Total Received:
                </Text>
              </Box>
              <Box flex="1">
                <Text fontSize="13px">{formatBytes(statistics.audio?.inbounds[0].totalBytesReceived)}</Text>
              </Box>
            </Flex>
          )}
          <Flex w="100%">
            <Box flex="1">
              <Text fontSize="13px" color="dolbySecondary.200">
                Codecs:
              </Text>
            </Box>
            <Box flex="1">
              {statistics.video.outbounds.length > 0 && (
                <Text fontSize="13px">
                  {statistics.video?.outbounds[0].mimeType}, {statistics.audio?.outbounds[0].mimeType}
                </Text>
              )}
              {statistics.video.inbounds.length > 0 && (
                <Text fontSize="13px">
                  {statistics.video?.inbounds[0].mimeType}, {statistics.audio?.inbounds[0].mimeType}
                </Text>
              )}
            </Box>
          </Flex>
          <Flex w="100%">
            <Box flex="1">
              <Text fontSize="13px" color="dolbySecondary.200">
                Timestamp:
              </Text>
            </Box>
            <Box flex="1">
              {statistics.video?.outbounds.length > 0 && (
                <Text fontSize="13px">
                  {formatTimestamp(
                    statistics.video?.outbounds[0].timestamp || statistics.audio?.outbounds[0].timestamp
                  )}
                </Text>
              )}
              {statistics.video?.inbounds.length > 0 && (
                <Text fontSize="13px">
                  {formatTimestamp(statistics.video?.inbounds[0].timestamp || statistics.audio?.inbounds[0].timestamp)}
                </Text>
              )}
            </Box>
          </Flex>
        </>
      ) : (
        <Text>No Statistics</Text>
      )}
    </VStack>
  );
};

export default memo(StatisticsInfo);
