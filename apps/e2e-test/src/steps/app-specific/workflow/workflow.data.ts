type ViewData = { [key: string]: string };

const ViewDefaultData: ViewData = {
  size: 'Normal',
  'source name': 'displayed',
  'setting button': 'displayed|enabled',
  'audio button': 'displayed|enabled',
  'audio button status': 'On',
  'video button': 'displayed|enabled',
  'video button status': 'On',
  'full screen button': 'hidden',
  'close button': 'displayed|enabled',
};

const previewViewDefaultData: ViewData = {
  ...ViewDefaultData,
  'stream info button': 'hidden',
  'go live button': 'displayed|enabled',
  'go live button text': 'GO LIVE',
  'stop button': 'hidden',
  'stop button text': 'ignore: ',
};

const streamingViewDefaultData: ViewData = {
  ...ViewDefaultData,
  'stream info button': 'displayed|enabled',
  'go live button': 'hidden',
  'go live button text': 'ignore: ',
  'stop button': 'displayed|enabled',
  'stop button text': 'STOP',
};

const publisherPreviewCameraViewDefaultData: ViewData = {
  ...previewViewDefaultData,
  'source name text': 'contains: fake',
};

const publisherStreamingCameraViewDefaultData: ViewData = {
  ...streamingViewDefaultData,
  'source name text': 'contains: fake',
};

const publisherPreviewScreenViewDefaultData: ViewData = {
  ...previewViewDefaultData,
  'source name text': 'contains: screen',
};

const publisherStreamingScreenViewDefaultData: ViewData = {
  ...streamingViewDefaultData,
  'source name text': 'contains: screen',
};

const publisherPreviewLocalFileViewDefaultData: ViewData = {
  ...previewViewDefaultData,
  'source name text': 'contains: local-file.mp4',
  'playback button': 'displayed|enabled',
  'playback button status': 'On',
};

const publisherStreamingLocalFileViewDefaultData: ViewData = {
  ...streamingViewDefaultData,
  'source name text': 'contains: local-file.mp4',
  'playback button': 'displayed|enabled',
  'playback button status': 'On',
};

const viewerStreamingMainViewDefaultData: ViewData = {
  ...ViewDefaultData,
  'source name text': 'ignore: ',
  'audio button': 'displayed|enabled',
  'audio button status': 'Off',
  'playback button': 'displayed|enabled',
  'playback button status': 'On',
  'full screen button': 'displayed|enabled',
  'stream info button': 'displayed|enabled',
  'go live button': 'hidden',
  'go live button text': 'ignore: ',
  'stop button': 'hidden',
  'stop button text': 'ignore: ',
  'close button': 'hidden',
};

const headerData: ViewData = {
  'company name': 'displayed',
  'company name text': 'Company name',
  timer: 'displayed',
  'multi source label': 'hidden',
  'multi source label text': 'ignore: ',
};

const publisherPreviewHeaderData: ViewData = {
  ...headerData,
  'timer text': '00:00:00',
  'invite button': 'displayed|enabled',
  'invite button text': 'Invite viewers',
  'page header': 'displayed',
  'page header text': 'Get started',
  'page description': 'displayed',
  'page description text': 'Setup your audio and video before going live.',
  'streaming status dot': 'hidden',
  'viewers count': 'hidden',
  'go live button': 'displayed|enabled',
  'go live button text': 'GO LIVE',
};

const publisherStreamingHeaderData: ViewData = {
  ...headerData,
  'timer text': 'regex: ^((?!00:00:00).)*$',
  'invite button': 'displayed|enabled',
  'invite button text': 'Invite viewers',
  'page header': 'hidden',
  'page description': 'hidden',
  'streaming status dot': 'displayed',
  'viewers count': 'displayed',
  'viewers count text': '0 Viewers',
  'stop button': 'displayed|enabled',
  'stop button text': 'STOP',
};

const viewerWaitingRoomHeaderData: ViewData = {
  ...headerData,
  'timer text': '00:00:00',
  'page header': 'displayed',
  'page header text': 'Stream is not live',
  'page description': 'displayed',
  'page description text': 'Please wait for livestream to begin.',
  'streaming status dot': 'hidden',
  'viewers count': 'hidden',
};

const viewerStreamingHeaderData: ViewData = {
  ...headerData,
  'timer text': 'regex: ^((?!00:00:00).)*$',
  'page header': 'hidden',
  'page description': 'hidden',
  'streaming status dot': 'displayed',
  'viewers count': 'displayed',
  'viewers count text': '1 Viewer',
};

const publisherPreviewFooterData: ViewData = {
  'add source button': 'displayed|enabled',
  'add source button text': 'Add Source',
  'app version': 'displayed',
  'app version text': 'Version: 2.1.0',
};

const publisherStreamingFooterData: ViewData = publisherPreviewFooterData;

const viewerWaitingRoomFooterData: ViewData = {
  'add source button': 'hidden',
  'app version': 'displayed',
  'app version text': 'Version: 2.1.0',
};

const viewerStreamingFooterData: ViewData = viewerWaitingRoomFooterData;

const viewConfigureSettings: ViewData = {
  'source name': 'ignore: ',
  bitrate: 'Auto',
  simulcast: 'On',
  codec: 'h264',
};

const publisherPreviewCameraViewConfigureSettings: ViewData = {
  ...viewConfigureSettings,
  resolution: '640x480',
};

const publisherPreviewScreenViewConfigureSettings: ViewData = {
  ...viewConfigureSettings,
};

const publisherPreviewLocalFileViewConfigureSettings: ViewData = {
  ...viewConfigureSettings,
};

const publisherStreamingCameraViewConfigureSettings: ViewData = {
  resolution: '640x480',
  bitrate: 'Auto',
};

const publisherStreamingScreenViewConfigureSettings: ViewData = {
  bitrate: 'Auto',
};

const publisherStreamingLocalFileViewConfigureSettings: ViewData = {
  bitrate: 'Auto',
};

const viewerStreamingMainViewConfigureSettings: ViewData = {
  quality: 'Auto',
};

const viewSettingsData: ViewData = {
  bitrate: 'Bitrate  - Auto',
  simulcast: 'On',
  codec: 'Codec  - h264',
};

const publisherPreviewCameraViewSettingsData: ViewData = {
  ...viewSettingsData,
  'source name': 'contains: fake',
  resolution: 'Resolution  - 640x480',
};

const publisherStreamingCameraViewSettingsData: ViewData = {
  resolution: 'Resolution  - 640x480',
  bitrate: 'Bitrate  - Auto',
};

const publisherPreviewScreenViewSettingsData: ViewData = {
  ...viewSettingsData,
  'source name': 'contains: screen',
};

const publisherStreamingScreenViewSettingsData: ViewData = {
  bitrate: 'Bitrate  - Auto',
};

const publisherPreviewLocalFileViewSettingsData: ViewData = {
  ...viewSettingsData,
  'source name': 'contains: local-file.mp4',
};

const publisherStreamingLocalFileViewSettingsData: ViewData = {
  bitrate: 'Bitrate  - Auto',
};

const viewerStreamingMainViewSettingsData: ViewData = {
  quality: 'Quality  - Auto',
};

const viewStatsData: ViewData = {
  Name: 'Value',
  'Current RTT:': 'regex: \\d{1,3} ms',
  'Outgoing bitrate:': 'regex: ([0-9]*[.])?[0-9]+ (kbps|Mbps)',
  'Candidate type:': 'regex: (srflx|prflx|relay)',
  'Video resolution:': 'regex: \\d{3,4}x\\d{3,4}',
  'Quality limitation reason:': 'regex: (bandwidth|cpu|none)',
  'Frames per second:': 'regex: \\d{1,2}',
  'Video bitrate:': 'regex: ([0-9]*[.])?[0-9]+(bps| kbps| Mbps)',
  'Audio bitrate:': 'regex: ([0-9]*[.])?[0-9]+(bps| kbps| Mbps)',
  'Codecs:': 'video/H264, audio/opus',
  'Timestamp:':
    'regex: (([1-9]|1[0-2])/([1-9]|0[1-9]|[1-2][0-9]|3[0-1])/[0-9]{4}\\s([1-9]|[1][0-2]):([0-5][0-9]|[0-9]):([0-5][0-9]|[0-9])\\s[A|P]M)|((0[1-9]|[1-2][0-9]|3[0-1])/(0[1-9]|1[0-2])/[0-9]{4}\\s(2[0-3]|[01][0-9]|[0-9]):([0-5][0-9]|[0-9]):([0-5][0-9]))',
};

const publisherCameraViewStatsData: ViewData = {
  ...viewStatsData,
  'Video total sent:': 'regex: ([0-9]*[.])?[0-9]+ (kB|MB)',
  'Audio total sent:': 'regex: ([0-9]*[.])?[0-9]+ (kB|MB)',
};

const publisherScreenViewStatsData: ViewData = {
  ...viewStatsData,
  'Video total sent:': 'regex: ([0-9]*[.])?[0-9]+ (kB|MB)',
  'Audio total sent:': 'regex: ([0-9]*[.])?[0-9]+ (kB|MB)',
};

const publisherLocalFileViewStatsData: ViewData = {
  ...viewStatsData,
  'Video total sent:': 'regex: ([0-9]*[.])?[0-9]+ (KB|MB)',
  'Audio total sent:': 'regex: ([0-9]*[.])?[0-9]+ (KB|MB)',
};

const viewerMainViewStatsData: ViewData = {
  ...viewStatsData,
  'Video total received:': 'regex: ([0-9]*[.])?[0-9]+ (kB|MB)',
  'Audio total received:': 'regex: ([0-9]*[.])?[0-9]+ (kB|MB)',
};

export const getDefaultViewData = (viewName: string) => {
  switch (viewName) {
    case 'publisher preview camera view':
      return publisherPreviewCameraViewDefaultData;
    case 'publisher publisher-streaming camera view':
      return publisherStreamingCameraViewDefaultData;
    case 'publisher preview screen view':
      return publisherPreviewScreenViewDefaultData;
    case 'publisher publisher-streaming screen view':
      return publisherStreamingScreenViewDefaultData;
    case 'publisher preview local file view':
      return publisherPreviewLocalFileViewDefaultData;
    case 'publisher publisher-streaming local file view':
      return publisherStreamingLocalFileViewDefaultData;
    case 'viewer viewer-streaming main view':
      return viewerStreamingMainViewDefaultData;
    default:
      throw Error(`Invalid view name ${viewName}`);
  }
};

export const getDefaultHeaderData = (headerName: string) => {
  switch (headerName) {
    case 'publisher preview header':
      return publisherPreviewHeaderData;
    case 'publisher publisher-streaming header':
      return publisherStreamingHeaderData;
    case 'viewer waiting-room header':
      return viewerWaitingRoomHeaderData;
    case 'viewer viewer-streaming header':
      return viewerStreamingHeaderData;
    default:
      throw Error(`Invalid header name ${headerName}`);
  }
};

export const getDefaultFooterData = (headerName: string) => {
  switch (headerName) {
    case 'publisher preview footer':
      return publisherPreviewFooterData;
    case 'publisher publisher-streaming footer':
      return publisherStreamingFooterData;
    case 'viewer waiting-room footer':
      return viewerWaitingRoomFooterData;
    case 'viewer viewer-streaming footer':
      return viewerStreamingFooterData;
    default:
      throw Error(`Invalid footer name ${headerName}`);
  }
};

export const getDefaultConfigureSettings = (viewName: string) => {
  switch (viewName) {
    case 'publisher preview camera view':
      return publisherPreviewCameraViewConfigureSettings;
    case 'publisher preview screen view':
      return publisherPreviewScreenViewConfigureSettings;
    case 'publisher preview local file view':
      return publisherPreviewLocalFileViewConfigureSettings;
    case 'publisher publisher-streaming camera view':
      return publisherStreamingCameraViewConfigureSettings;
    case 'publisher publisher-streaming screen view':
      return publisherStreamingScreenViewConfigureSettings;
    case 'publisher publisher-streaming local file view':
      return publisherStreamingLocalFileViewConfigureSettings;
    case 'viewer viewer-streaming main view':
      return viewerStreamingMainViewConfigureSettings;
    default:
      throw Error(`Invalid view name ${viewName}`);
  }
};

export const getDefaultSettingsData = (viewName: string) => {
  switch (viewName) {
    case 'publisher preview camera view':
      return publisherPreviewCameraViewSettingsData;
    case 'publisher preview screen view':
      return publisherPreviewScreenViewSettingsData;
    case 'publisher preview local file view':
      return publisherPreviewLocalFileViewSettingsData;
    case 'publisher publisher-streaming camera view':
      return publisherStreamingCameraViewSettingsData;
    case 'publisher publisher-streaming screen view':
      return publisherStreamingScreenViewSettingsData;
    case 'publisher publisher-streaming local file view':
      return publisherStreamingLocalFileViewSettingsData;
    case 'viewer viewer-streaming main view':
      return viewerStreamingMainViewSettingsData;
    default:
      throw Error(`Invalid view name ${viewName}`);
  }
};

export const getDefaultStatsData = (viewName: string) => {
  switch (viewName) {
    case 'publisher publisher-streaming camera view':
      return publisherCameraViewStatsData;
    case 'publisher publisher-streaming screen view':
      return publisherScreenViewStatsData;
    case 'publisher publisher-streaming local file view':
      return publisherLocalFileViewStatsData;
    case 'viewer viewer-streaming main view':
      return viewerMainViewStatsData;
    default:
      throw Error(`Invalid view name ${viewName}`);
  }
};
