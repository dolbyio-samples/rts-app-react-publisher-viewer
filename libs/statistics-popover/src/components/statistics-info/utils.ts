import { KILO, MEGA } from './constants';

export const formatBitrate = (bitrate: number): string => `${formatNumberByMagnitude(bitrate)}bps`;

export const formatBytes = (bytes: number): string => `${formatNumberByMagnitude(bytes)}B`;

export const formatNumberByMagnitude = (input: number): string => {
  if (input < KILO) {
    return `${input.toFixed(2)}`;
  }

  if (input >= KILO && input < MEGA) {
    return `${(input / KILO).toFixed(2)} k`;
  }

  if (input >= MEGA) {
    return `${(input / MEGA).toFixed(2)} M`;
  }

  return '0';
};

export const formatTimestamp = (timestampMs?: number): string => {
  if (!timestampMs) return '';

  const date = new Date(0);
  date.setUTCMilliseconds(timestampMs);

  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};
