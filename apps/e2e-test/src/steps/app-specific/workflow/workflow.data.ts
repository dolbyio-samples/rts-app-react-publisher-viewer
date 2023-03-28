type ViewData = {
  [key: string]: string;
};

const ViewDefaultData: ViewData = {
  'audio button': 'displayed|enabled',
  'audio button status': 'On',
  'close button': 'displayed|enabled',
  'full screen button': 'hidden',
  'setting button': 'displayed|enabled',
  size: 'Normal',
  'source name': 'displayed',
  'video button': 'displayed|enabled',
  'video button status': 'On',
};

const previewViewDefaultData: ViewData = {
  ...ViewDefaultData,
  'go live button': 'displayed|enabled',
  'go live button text': 'GO LIVE',
  'stop button': 'hidden',
  'stop button text': 'ignore: ',
  'stream info button': 'hidden',
};

const streamingViewDefaultData: ViewData = {
  ...ViewDefaultData,
  'go live button': 'hidden',
  'go live button text': 'ignore: ',
  'stop button': 'displayed|enabled',
  'stop button text': 'STOP',
  'stream info button': 'displayed|enabled',
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
  'playback button': 'displayed|enabled',
  'playback button status': 'On',
  'source name text': 'contains: local-file.mp4',
};

const publisherStreamingLocalFileViewDefaultData: ViewData = {
  ...streamingViewDefaultData,
  'playback button': 'displayed|enabled',
  'playback button status': 'On',
  'source name text': 'contains: local-file.mp4',
};

const viewerStreamingMainViewDefaultData: ViewData = {
  ...ViewDefaultData,
  'audio button': 'displayed|enabled',
  'audio button status': 'Off',
  'close button': 'hidden',
  'full screen button': 'displayed|enabled',
  'go live button': 'hidden',
  'go live button text': 'ignore: ',
  'playback button': 'displayed|enabled',
  'playback button status': 'On',
  'source name text': 'ignore: ',
  'stop button': 'hidden',
  'stop button text': 'ignore: ',
  'stream info button': 'displayed|enabled',
};

const headerData: ViewData = {
  'company name': 'displayed',
  'company name text': 'Company name',
  'multi source label': 'hidden',
  'multi source label text': 'ignore: ',
  timer: 'displayed',
};

const publisherPreviewHeaderData: ViewData = {
  ...headerData,
  'go live button': 'displayed|enabled',
  'go live button text': 'GO LIVE',
  'invite button': 'displayed|enabled',
  'invite button text': 'Invite viewers',
  'page description': 'displayed',
  'page description text': 'Setup your audio and video before going live.',
  'page header': 'displayed',
  'page header text': 'Get started',
  'streaming status dot': 'hidden',
  'timer text': '00:00:00',
  'viewers count': 'hidden',
};

const publisherStreamingHeaderData: ViewData = {
  ...headerData,
  'invite button': 'displayed|enabled',
  'invite button text': 'Invite viewers',
  'page description': 'hidden',
  'page header': 'hidden',
  'stop button': 'displayed|enabled',
  'stop button text': 'STOP',
  'streaming status dot': 'displayed',
  'timer text': 'regex: ^((?!00:00:00).)*$',
  'viewers count': 'displayed',
  'viewers count text': '0 Viewers',
};

const viewerWaitingRoomHeaderData: ViewData = {
  ...headerData,
  'page description': 'displayed',
  'page description text': 'Please wait for livestream to begin.',
  'page header': 'displayed',
  'page header text': 'Stream is not live',
  'streaming status dot': 'hidden',
  'timer text': '00:00:00',
  'viewers count': 'hidden',
};

const viewerStreamingHeaderData: ViewData = {
  ...headerData,
  'page description': 'hidden',
  'page header': 'hidden',
  'streaming status dot': 'displayed',
  'timer text': 'regex: ^((?!00:00:00).)*$',
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
  bitrate: 'Auto',
  codec: 'h264',
  simulcast: 'On',
  'source name': 'ignore: ',
};

const publisherPreviewCameraViewConfigureSettings: ViewData = {
  ...viewConfigureSettings,
  resolution: '3840x2160',
};

const publisherPreviewScreenViewConfigureSettings: ViewData = {
  ...viewConfigureSettings,
};

const publisherPreviewLocalFileViewConfigureSettings: ViewData = {
  ...viewConfigureSettings,
};

const publisherStreamingCameraViewConfigureSettings: ViewData = {
  bitrate: 'Auto',
  resolution: '3840x2160',
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
  codec: 'Codec  - h264',
  simulcast: 'On',
};

const publisherPreviewCameraViewSettingsData: ViewData = {
  ...viewSettingsData,
  resolution: 'Resolution  - 3840x2160',
  'source name': 'contains: fake',
};

const publisherStreamingCameraViewSettingsData: ViewData = {
  bitrate: 'Bitrate  - Auto',
  resolution: 'Resolution  - 3840x2160',
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
  'Audio bitrate:': 'regex: ([0-9]*[.])?[0-9]+(bps| kbps| Mbps)',
  'Candidate type:': 'regex: (srflx|prflx|relay)',
  'Codecs:': 'video/H264, audio/opus',
  'Current RTT:': 'regex: \\d{1,3} ms',
  'Frames per second:': 'regex: \\d{1,2}',
  Name: 'Value',
  'Outgoing bitrate:': 'regex: ([0-9]*[.])?[0-9]+ (kbps|Mbps)',
  'Quality limitation reason:': 'regex: (bandwidth|cpu|none)',
  'Timestamp:':
    'regex: (([1-9]|1[0-2])/([1-9]|0[1-9]|[1-2][0-9]|3[0-1])/[0-9]{4}\\s([1-9]|[1][0-2]):([0-5][0-9]|[0-9]):([0-5][0-9]|[0-9])\\s[A|P]M)|((0[1-9]|[1-2][0-9]|3[0-1])/(0[1-9]|1[0-2])/[0-9]{4}\\s(2[0-3]|[01][0-9]|[0-9]):([0-5][0-9]|[0-9]):([0-5][0-9]))',
  'Video bitrate:': 'regex: ([0-9]*[.])?[0-9]+(bps| kbps| Mbps)',
  'Video resolution:': 'regex: \\d{3,4}x\\d{3,4}',
};

const publisherCameraViewStatsData: ViewData = {
  ...viewStatsData,
  'Audio total sent:': 'regex: ([0-9]*[.])?[0-9]+ (kB|MB)',
  'Video total sent:': 'regex: ([0-9]*[.])?[0-9]+ (kB|MB)',
};

const publisherScreenViewStatsData: ViewData = {
  ...viewStatsData,
  'Audio total sent:': 'regex: ([0-9]*[.])?[0-9]+ (kB|MB)',
  'Video total sent:': 'regex: ([0-9]*[.])?[0-9]+ (kB|MB)',
};

const publisherLocalFileViewStatsData: ViewData = {
  ...viewStatsData,
  'Audio total sent:': 'regex: ([0-9]*[.])?[0-9]+ (KB|MB)',
  'Video total sent:': 'regex: ([0-9]*[.])?[0-9]+ (KB|MB)',
};

const viewerMainViewStatsData: ViewData = {
  ...viewStatsData,
  'Audio total received:': 'regex: ([0-9]*[.])?[0-9]+ (kB|MB)',
  'Video total received:': 'regex: ([0-9]*[.])?[0-9]+ (kB|MB)',
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
