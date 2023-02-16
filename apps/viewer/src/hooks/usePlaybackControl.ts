import { useEffect, useState } from 'react';

import { ViewerVideoViewProps } from '../components/viewer-video-view';

const usePlaybackControl = (sourceIds: string[]) => {
  const [playbackControl, setPlaybackControl] = useState<Record<string, ViewerVideoViewProps['controls']>>({});

  useEffect(() => {
    setPlaybackControl((prevPlaybackSettings) =>
      sourceIds.reduce((accPlaybackSettings, sourceId) => {
        if (sourceId in accPlaybackSettings) {
          return accPlaybackSettings;
        }

        return {
          ...accPlaybackSettings,
          [sourceId]: {
            audioEnabled: false,
            fullScreen: false,
            onChangeVolume: changePlaybackControl(sourceId, 'volume'),
            onToggleAudio: changePlaybackControl(sourceId, 'audioEnabled'),
            onToggleFullScreen: changePlaybackControl(sourceId, 'fullScreen'),
            onToggleVideo: changePlaybackControl(sourceId, 'videoEnabled'),
            videoEnabled: true,
            volume: 0,
          },
        };
      }, prevPlaybackSettings)
    );
  }, [sourceIds.length]);

  const changePlaybackControl =
    (sourceId: string, setting: keyof ViewerVideoViewProps['controls']) =>
    <T>(value: T) => {
      setPlaybackControl((prevPlaybackSettings) => {
        const sourcePlaybackSettings = prevPlaybackSettings[sourceId];

        if (!sourcePlaybackSettings) {
          return prevPlaybackSettings;
        }

        const newValue = typeof value === 'function' ? value(sourcePlaybackSettings[setting]) : value;

        return {
          ...prevPlaybackSettings,
          [sourceId]: {
            ...prevPlaybackSettings[sourceId],
            [setting]: newValue,
          },
        };
      });
    };

  return playbackControl;
};

export default usePlaybackControl;
