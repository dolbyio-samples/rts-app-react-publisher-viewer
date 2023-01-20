import {
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
} from '@chakra-ui/react';
import React, { useMemo } from 'react';

import { IconInfo } from '@millicast-react/dolbyio-icons';
import IconButton from '@millicast-react/icon-button';
import Tabs from '@millicast-react/tabs';

import StatisticsInfo from './components/statistics-info';
import { StatisticsPopoverProps, TabQualities } from './types';

const StatisticsPopover = ({ statistics }: StatisticsPopoverProps) => {
  const {
    audio: { inbounds: audioIn, outbounds: audioOut },
    video: { inbounds: videoIn, outbounds: videoOut },
  } = statistics;

  const [audio] = audioIn?.length ? audioIn : audioOut?.length ? audioOut : [];
  const video = videoIn?.length ? videoIn : videoOut?.length ? videoOut : [];

  const tabs = useMemo(() => {
    const streamVideoStats = [...video].sort((a, b) => b.bitrate - a.bitrate);
    const qualities: TabQualities = [];

    switch (streamVideoStats.length) {
      case 2:
        qualities.push('High', 'Low');
        break;
      case 3:
        qualities.push('High', 'Medium', 'Low');
        break;
      default:
        return [];
    }

    return qualities.map((quality, index) => ({
      children: (
        <StatisticsInfo
          statistics={{
            ...statistics,
            audio,
            video: streamVideoStats[index],
          }}
        />
      ),
      heading: quality,
      id: quality,
    }));
  }, [statistics]);

  return (
    <>
      <Popover gutter={-32} isLazy placement="top-start">
        <PopoverTrigger>
          <IconButton
            aria-label="Stream Information"
            background="transparent"
            borderRadius="50%"
            className="icon-button"
            icon={<IconInfo fill="white" />}
            isRound
            size="sm"
            testId="streamInfoButton"
            tooltipProps={{ label: 'Stream information' }}
          />
        </PopoverTrigger>
        <Portal>
          <PopoverContent bg="dolbyNeutral.800" width="400px" border="none" p={6}>
            <PopoverHeader
              test-id="streamInfoPopoverTitle"
              border="none"
              color="white"
              fontSize="16px"
              fontWeight="600"
              mb="16px"
              p={0}
            >
              Stream information
            </PopoverHeader>
            <PopoverCloseButton test-id="popoverCloseButton" color="white" />
            <PopoverBody p={0}>
              {tabs.length ? (
                <Tabs tabs={tabs} />
              ) : (
                <StatisticsInfo statistics={{ ...statistics, audio, video: video[0] }} />
              )}
            </PopoverBody>
          </PopoverContent>
        </Portal>
      </Popover>
    </>
  );
};

export default StatisticsPopover;
