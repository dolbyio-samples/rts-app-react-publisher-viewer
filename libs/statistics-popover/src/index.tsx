import React, { useMemo } from 'react';

import { IconInfo } from '@millicast-react/dolbyio-icons';
import Popover from '@millicast-react/popover';
import Tabs from '@millicast-react/tabs';

import StatisticsInfo from './components/statistics-info';
import { StatisticsPopoverProps, TabQualities } from './types';

const StatisticsPopover = ({ iconProps, statistics }: StatisticsPopoverProps) => {
  const { audio: audioIn, video: videoIn } = statistics?.input ?? {};
  const { audio: audioOut, video: videoOut } = statistics?.output ?? {};

  const [audio] = audioIn?.length ? audioIn : audioOut?.length ? audioOut : [];
  const videos = videoIn?.length ? videoIn : videoOut?.length ? videoOut : [];

  Array.from(videos)
    .filter(({ bitrate }) => bitrate)
    .sort((a, b) => (b.bitrate as number) - (a.bitrate as number));

  const tabs = useMemo(() => {
    const streamVideoStats = Array.from(videos)
      .filter(({ bitrate }) => bitrate)
      .sort((a, b) => (b.bitrate as number) - (a.bitrate as number));

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
    <Popover
      heading="Stream information"
      icon={<IconInfo fill="white" />}
      iconProps={iconProps}
      label="Stream information"
      placement="top-start"
    >
      {statistics ? (
        tabs.length ? (
          <Tabs tabs={tabs} />
        ) : (
          <StatisticsInfo statistics={{ ...statistics, audio, video: videos[0] }} />
        )
      ) : undefined}
    </Popover>
  );
};

export default StatisticsPopover;
