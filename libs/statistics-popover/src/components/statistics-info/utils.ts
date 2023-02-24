import { KILO, MEGA } from './constants';

export const formatBitrate = (bitrate: number): string => {
  return `${formatNumberByMagnitude(bitrate)}bps`;
};

export const formatBytes = (bytes: number): string => {
  return `${formatNumberByMagnitude(bytes)}B`;
};

export const formatNumberByMagnitude = (input: number): string => {
  if (input < KILO) return `${input}`;

  if (input >= KILO && input < MEGA) return `${(input / KILO).toFixed(2)} k`;

  return `${(input / MEGA).toFixed(2)} M`;
};

export const formatTimestamp = (timestampMs?: number): string => {
  if (!timestampMs) return '';

  const date = new Date(0);
  date.setUTCMilliseconds(timestampMs);

  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};
