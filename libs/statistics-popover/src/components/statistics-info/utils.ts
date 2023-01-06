import { KILOBYTES, MEGABYTES } from './constants';

export const formatBitrate = (bitrate: number): string => {
  return `${formatNumberByMagnitude(bitrate)}bps`;
};

export const formatBytes = (bytes: number): string => {
  return `${formatNumberByMagnitude(bytes)}B`;
};

export const formatNumberByMagnitude = (input: number): string => {
  if (input < KILOBYTES) return `${input}`;

  if (input >= KILOBYTES && input < MEGABYTES) return `${(input / KILOBYTES).toFixed(2)} K`;

  return `${(input / MEGABYTES).toFixed(2)} M`;
};

export const formatTimestamp = (timestampMs?: number): string => {
  if (!timestampMs) return '';

  const date = new Date(0);
  date.setUTCMilliseconds(timestampMs);

  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};
