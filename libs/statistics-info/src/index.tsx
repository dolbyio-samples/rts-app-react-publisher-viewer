import React, { memo } from 'react';
import type { StreamStats } from '@millicast/sdk';

import { VStack, Flex, Box, Text, Heading } from '@chakra-ui/react';

type StatisticsInfoProps = {
  statistics?: StreamStats;
};

const StatisticsInfo = ({ statistics }: StatisticsInfoProps) => {
  return (
    <VStack
      test-id="statisticsInfo"
      minW="350px"
      pos="absolute"
      top="0"
      left="0"
      p="10px"
      bg="rgba(0,0,0,0.6)"
      color="white"
    >
      {statistics ? (
        <>
          <Heading as="h4" size="sm">
            Stream Information:
          </Heading>
          <Flex w="100%">
            <Box flex="1">
              <Text fontSize="sm" fontWeight="bold">
                Name
              </Text>
            </Box>
            <Box flex="1">
              <Text fontSize="sm" fontWeight="bold">
                Value
              </Text>
            </Box>
          </Flex>
          {statistics.currentRoundTripTime && (
            <Flex w="100%">
              <Box flex="1">
                <Text fontSize="sm">Current RTT:</Text>
              </Box>
              <Box flex="1">
                <Text fontSize="sm">{statistics.currentRoundTripTime * 1000} ms</Text>
              </Box>
            </Flex>
          )}
          {statistics.availableOutgoingBitrate && (
            <Flex w="100%">
              <Box flex="1">
                <Text fontSize="sm">Available Outgoing Bitrate:</Text>
              </Box>
              <Box flex="1">
                <Text fontSize="sm">{statistics.availableOutgoingBitrate / 1000} kbps</Text>
              </Box>
            </Flex>
          )}
          {statistics.candidateType && (
            <Flex w="100%">
              <Box flex="1">
                <Text fontSize="sm">Candidate Type:</Text>
              </Box>
              <Box flex="1">
                <Text fontSize="sm">{statistics.candidateType}</Text>
              </Box>
            </Flex>
          )}
          <Flex w="100%">
            <Box flex="1">
              <Text fontSize="sm">Video Resolution:</Text>
            </Box>
            <Box flex="1">
              {statistics.video?.outbounds.length > 0 && (
                <Text fontSize="sm">
                  {statistics.video?.outbounds[0].frameWidth}x{statistics.video?.outbounds[0].frameHeight}
                </Text>
              )}
              {statistics.video?.inbounds.length > 0 && (
                <Text fontSize="sm">
                  {statistics.video?.inbounds[0].frameWidth}x{statistics.video?.inbounds[0].frameHeight}
                </Text>
              )}
            </Box>
          </Flex>
          {statistics.video?.outbounds.length > 0 && (
            <Flex w="100%">
              <Box flex="1">
                <Text fontSize="sm">Quality Limitation Reason:</Text>
              </Box>
              <Box flex="1">
                <Text fontSize="sm">{statistics.video?.outbounds[0].qualityLimitationReason}</Text>
              </Box>
            </Flex>
          )}
          <Flex w="100%">
            <Box flex="1">
              <Text fontSize="sm">FPS:</Text>
            </Box>
            <Box flex="1">
              {statistics.video?.outbounds.length > 0 && (
                <Text fontSize="sm">{statistics.video?.outbounds[0].framesPerSecond}</Text>
              )}
              {statistics.video?.inbounds.length > 0 && (
                <Text fontSize="sm">{statistics.video?.inbounds[0].framesPerSecond}</Text>
              )}
            </Box>
          </Flex>
          <Flex w="100%">
            <Box flex="1">
              <Text fontSize="sm">Video Bitrate:</Text>
            </Box>
            <Box flex="1">
              {statistics.video?.outbounds.length > 0 && (
                <Text fontSize="sm">{statistics.video?.outbounds[0].bitrate / 1000} kbps</Text>
              )}
              {statistics.video?.inbounds.length > 0 && (
                <Text fontSize="sm">{statistics.video?.inbounds[0].bitrate / 1000} kbps</Text>
              )}
            </Box>
          </Flex>
          <Flex w="100%">
            <Box flex="1">
              <Text fontSize="sm">Audio Bitrate:</Text>
            </Box>
            <Box flex="1">
              {statistics.audio?.outbounds.length > 0 && (
                <Text fontSize="sm">{statistics.audio?.outbounds[0].bitrate / 1000} kbps</Text>
              )}
              {statistics.audio?.inbounds.length > 0 && (
                <Text fontSize="sm">{statistics.audio?.inbounds[0].bitrate / 1000} kbps</Text>
              )}
            </Box>
          </Flex>
          {statistics.video?.outbounds.length > 0 && (
            <Flex w="100%">
              <Box flex="1">
                <Text fontSize="sm">Video Total Sent:</Text>
              </Box>
              <Box flex="1">
                <Text fontSize="sm">{statistics.video?.outbounds[0].totalBytesSent / 1000} KB</Text>
              </Box>
            </Flex>
          )}
          {statistics.video?.inbounds.length > 0 && (
            <Flex w="100%">
              <Box flex="1">
                <Text fontSize="sm">Video Total Received:</Text>
              </Box>
              <Box flex="1">
                <Text fontSize="sm">{statistics.video?.inbounds[0].totalBytesReceived / 1000} KB</Text>
              </Box>
            </Flex>
          )}
          {statistics.audio?.outbounds.length > 0 && (
            <Flex w="100%">
              <Box flex="1">
                <Text fontSize="sm">Audio Total Sent:</Text>
              </Box>
              <Box flex="1">
                <Text fontSize="sm">{statistics.audio?.outbounds[0].totalBytesSent / 1000} KB</Text>
              </Box>
            </Flex>
          )}
          {statistics.audio?.inbounds.length > 0 && (
            <Flex w="100%">
              <Box flex="1">
                <Text fontSize="sm">Audio Total Received:</Text>
              </Box>
              <Box flex="1">
                <Text fontSize="sm">{statistics.audio?.inbounds[0].totalBytesReceived / 1000} KB</Text>
              </Box>
            </Flex>
          )}
          <Flex w="100%">
            <Box flex="1">
              <Text fontSize="sm">Codecs:</Text>
            </Box>
            <Box flex="1">
              {statistics.video.outbounds.length > 0 && (
                <Text fontSize="sm">
                  {statistics.video?.outbounds[0].mimeType}, {statistics.audio?.outbounds[0].mimeType}
                </Text>
              )}
              {statistics.video.inbounds.length > 0 && (
                <Text fontSize="sm">
                  {statistics.video?.inbounds[0].mimeType}, {statistics.audio?.inbounds[0].mimeType}
                </Text>
              )}
            </Box>
          </Flex>
          <Flex w="100%">
            <Box flex="1">
              <Text fontSize="sm">Timestamp:</Text>
            </Box>
            <Box flex="1">
              {statistics.video?.outbounds.length > 0 && (
                <Text fontSize="sm">
                  {statistics.video?.outbounds[0].timestamp || statistics.audio?.outbounds[0].timestamp}
                </Text>
              )}
              {statistics.video?.inbounds.length > 0 && (
                <Text fontSize="sm">
                  {statistics.video?.inbounds[0].timestamp || statistics.audio?.inbounds[0].timestamp}
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
