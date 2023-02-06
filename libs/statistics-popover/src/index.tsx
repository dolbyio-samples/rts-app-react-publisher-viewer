import React, { useMemo } from 'react';

import { IconInfo } from '@millicast-react/dolbyio-icons';
import Popover from '@millicast-react/popover';
import Tabs from '@millicast-react/tabs';

import StatisticsInfo from './components/statistics-info';
import { StatisticsPopoverProps, TabQualities } from './types';

const StatisticsPopover = ({ iconProps, statistics }: StatisticsPopoverProps) => {
  const { inbounds: audioIn, outbounds: audioOut } = statistics?.audio ?? {};
  const { inbounds: videoIn, outbounds: videoOut } = statistics?.video ?? {};

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
    <Popover
      heading="Stream information"
      icon={<IconInfo fill="white" />}
      iconProps={iconProps}
      label="Stream information"
    >
      {statistics ? (
        tabs.length ? (
          <Tabs tabs={tabs} />
        ) : (
          <StatisticsInfo statistics={{ ...statistics, audio, video: video[0] }} />
        )
      ) : undefined}
    </Popover>
  );
};

export default StatisticsPopover;
