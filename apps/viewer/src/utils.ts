import { useMemo } from 'react';

export interface URLParameters {
  streamName: string;
  streamAccountId: string;
  isMultiviewEnabled: boolean;
}

export const useURLParameters = (): URLParameters => {
  return useMemo(() => {
    const href = new URL(window.location.href);

    const streamName = href.searchParams.get('streamName') ?? import.meta.env.VITE_RTS_STREAM_NAME;
    const streamAccountId = href.searchParams.get('streamAccountId') ?? import.meta.env.VITE_RTS_ACCOUNT_ID;
    const isMultiviewEnabled = href.searchParams.get('multisource')?.toLowerCase() !== 'false';

    return {
      streamName,
      streamAccountId,
      isMultiviewEnabled,
    };
  }, []);
};
