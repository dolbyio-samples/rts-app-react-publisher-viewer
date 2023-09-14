import { useEffect, useState } from 'react';

import { Controls } from './types';

/**
 * This hook is used to manage playback control states (e.g. audio/video enabled, volume level)
 * on a per-source basis.
 */
const usePlaybackControl = (sourceIds: string[]) => {
  const [playbackControl, setPlaybackControl] = useState<Record<string, Controls>>({});

  useEffect(() => {
    setPlaybackControl((prevPlaybackSettings) =>
      sourceIds.reduce((accPlaybackSettings, sourceId) => {
        if (sourceId in prevPlaybackSettings) {
          return { ...accPlaybackSettings, [sourceId]: prevPlaybackSettings[sourceId] };
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
      }, {})
    );
  }, [sourceIds.length]);

  const changePlaybackControl =
    (sourceId: string, setting: keyof Controls) =>
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

export * from './types';
export default usePlaybackControl;
