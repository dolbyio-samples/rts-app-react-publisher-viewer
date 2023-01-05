import { Box, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import {
  StreamAudioInboundsStats,
  StreamAudioOutboundsStats,
  StreamVideoInboundsStats,
  StreamVideoOutboundsStats,
} from '@millicast/sdk';
import React, { memo, useMemo } from 'react';

import { StatisticsInfoProps } from './types';
import { formatBitrate, formatBytes, formatTimestamp } from './utils';

const StatisticsInfo = ({ statistics }: StatisticsInfoProps) => {
  const { audio, availableOutgoingBitrate, candidateType, currentRoundTripTime, video } = statistics ?? {};

  const audioTotal = useMemo(() => {
    if (!audio) return undefined;

    if ('totalBytesReceived' in audio) return (audio as StreamAudioInboundsStats).totalBytesReceived;
    if ('totalBytesSent' in audio) return (audio as StreamAudioOutboundsStats).totalBytesSent;

    return undefined;
  }, [audio]);

  const videoTotal = useMemo(() => {
    if (!video) return undefined;

    if ('totalBytesReceived' in video) return (video as StreamVideoInboundsStats).totalBytesReceived;
    if ('totalBytesSent' in video) return (video as StreamVideoOutboundsStats).totalBytesSent;

    return undefined;
  }, [video]);

  return (
    <Box color="white" test-id="statisticsInfo" width="fit-content">
      {statistics ? (
        <TableContainer>
          <Table sx={{ tableLayout: 'fixed' }} variant="unstyled" width="100%">
            <Thead color="dolbyNeutral.100">
              <Tr sx={{ '&>th': { p: '0 0 8px', fontSize: '13px', textTransform: 'none' } }}>
                <Th width="175px">Name</Th>
                <Th width="165px">Value</Th>
              </Tr>
            </Thead>
            <Tbody
              sx={{
                '&>tr>*': { fontSize: '12px', lineHeight: 1.25 },
                '&>tr>td': { p: 0 },
                '&>tr>th': { color: 'dolbySecondary.200', p: '0 12px 0 0', textTransform: 'none' },
              }}
            >
              {currentRoundTripTime ? (
                <Tr>
                  <Th>Current RTT:</Th>
                  <Td>{currentRoundTripTime * 1000} ms</Td>
                </Tr>
              ) : undefined}
              {availableOutgoingBitrate && audio && video ? (
                <Tr>
                  <Th>Outgoing bitrate:</Th>
                  <Td>{formatBitrate(availableOutgoingBitrate)}</Td>
                </Tr>
              ) : undefined}
              {candidateType ? (
                <Tr>
                  <Th>Candidate type:</Th>
                  <Td>{candidateType}</Td>
                </Tr>
              ) : undefined}
              {video ? (
                <Tr>
                  <Th>Video resolution:</Th>
                  <Td>{video ? `${video.frameWidth}x${video.frameHeight}` : ''}</Td>
                </Tr>
              ) : undefined}
              {video && 'qualityLimitationReason' in video ? (
                <Tr>
                  <Th>Quality limitation reason:</Th>
                  <Td>{(video as StreamVideoOutboundsStats).qualityLimitationReason}</Td>
                </Tr>
              ) : undefined}
              {video ? (
                <>
                  <Tr>
                    <Th>Frames per second:</Th>
                    <Td>{video ? video.framesPerSecond || 0 : ''}</Td>
                  </Tr>
                  <Tr>
                    <Th>Video bitrate:</Th>
                    <Td>{video ? formatBitrate(video.bitrate) : ''}</Td>
                  </Tr>
                </>
              ) : undefined}
              {audio ? (
                <Tr>
                  <Th>Audio bitrate:</Th>
                  <Td>{audio ? formatBitrate(audio.bitrate) : ''}</Td>
                </Tr>
              ) : undefined}
              {videoTotal ? (
                <Tr>
                  <Th>Video total sent:</Th>
                  <Td>{formatBytes(videoTotal)}</Td>
                </Tr>
              ) : undefined}
              {audioTotal ? (
                <Tr>
                  <Th>Audio total sent:</Th>
                  <Td>{formatBytes(audioTotal)}</Td>
                </Tr>
              ) : undefined}
              {video ? (
                <Tr>
                  <Th>Codecs:</Th>
                  <Td>{video ? `${video.mimeType}` + (audio ? `, ${audio.mimeType}` : '') : ''}</Td>
                </Tr>
              ) : undefined}
              {video || audio ? (
                <Tr>
                  <Th>Timestamp:</Th>
                  <Td>{video ? formatTimestamp(video.timestamp) : ''}</Td>
                </Tr>
              ) : undefined}
            </Tbody>
          </Table>
        </TableContainer>
      ) : (
        <Text>No Statistics</Text>
      )}
    </Box>
  );
};

export * from './constants';
export * from './types';
export default memo(StatisticsInfo);
