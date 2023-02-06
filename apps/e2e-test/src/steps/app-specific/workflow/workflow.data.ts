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

const headerData: ViewData = {
  'company name': 'displayed',
  'company name text': 'Company name',
  timer: 'displayed',
  'multi source label': 'hidden',
  'multi source label text': 'ignore: ',
  'invite button': 'displayed|enabled',
  'invite button text': 'Invite viewers',
};

const publisherPreviewHeaderData: ViewData = {
  ...headerData,
  'timer text': '00:00:00',
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
  'page header': 'hidden',
  'page description': 'hidden',
  'streaming status dot': 'displayed',
  'viewers count': 'displayed',
  'viewers count text': '0 Viewers',
  'stop button': 'displayed|enabled',
  'stop button text': 'STOP',
};

const publisherPreviewFooterData: ViewData = {
  'add source button': 'displayed|enabled',
  'add source button text': 'Add Source',
  'app version': 'displayed',
  'app version text': 'Version: 2.0.0',
};

const publisherStreamingFooterData: ViewData = publisherPreviewFooterData;

const viewConfigureSettings: ViewData = {
  'source name': 'ignore: ',
  bitrate: 'Auto',
  simulcast: 'On',
  codec: 'h264',
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
  resolution: '3840x2160',
  bitrate: 'Auto',
};

const publisherStreamingScreenViewConfigureSettings: ViewData = {
  bitrate: 'Auto',
};

const publisherStreamingLocalFileViewConfigureSettings: ViewData = {
  bitrate: 'Auto',
};

const viewSettingsData: ViewData = {
  bitrate: 'Bitrate  - Auto',
  simulcast: 'On',
  codec: 'Codec  - h264',
};

const publisherPreviewCameraViewSettingsData: ViewData = {
  ...viewSettingsData,
  'source name': 'contains: fake',
  resolution: 'Resolution  - 3840x2160',
};

const publisherStreamingCameraViewSettingsData: ViewData = {
  resolution: 'Resolution  - 3840x2160',
  bitrate: 'Bitrate  - Auto',
};

const publisherPreviewScreenViewSettingsData: ViewData = {
  ...viewSettingsData,
  'source name': 'contains: screen',
};

const publisherStreamingScreenViewSettingsData: ViewData = {
  bitrate: 'Bitrate  - Auto',
};

const viewStatsData: ViewData = {
  Name: 'Value',
  'Current RTT:': 'regex: \\d{1,3} ms',
  'Video resolution:': 'regex: \\d{3,4}x\\d{3,4}',
  'Quality limitation reason:': 'regex: (bandwidth|cpu|none)',
  'Frames per second:': 'regex: \\d{1,2}',
  'Video bitrate:': 'regex: ([0-9]*[.])?[0-9]+(bps| kbps| mbps)',
  'Audio bitrate:': 'regex: ([0-9]*[.])?[0-9]+(bps| kbps| mbps)',
  'Video total sent:': 'regex: ([0-9]*[.])?[0-9]+ (KB|MB)',
  'Audio total sent:': 'regex: ([0-9]*[.])?[0-9]+ (KB|MB)',
  'Codecs:': 'video/H264, audio/opus',
  'Timestamp:':
    'regex: (([1-9]|1[0-2])/([1-9]|0[1-9]|[1-2][0-9]|3[0-1])/[0-9]{4} ([1-9]|[1][0-2]):([0-5][0-9]|[0-9]):([0-5][0-9]|[0-9]) [A|P]M)|((0[1-9]|[1-2][0-9]|3[0-1])/(0[1-9]|1[0-2])/[0-9]{4} (2[0-3]|[01][0-9]|[0-9]):([0-5][0-9]|[0-9]):([0-5][0-9]))',
};

const publisherCameraViewStatsData: ViewData = {
  ...viewStatsData,
  'Outgoing bitrate:': 'regex: ([0-9]*[.])?[0-9]+ (kbps|mbps)',
  'Candidate type:': 'regex: [s|p]rflx',
};

const publisherScreenViewStatsData: ViewData = {
  ...viewStatsData,
};

export const getDefaultViewData = (viewName: string) => {
  switch (viewName) {
    case 'publisher preview camera view':
      return publisherPreviewCameraViewDefaultData;
    case 'publisher streaming camera view':
      return publisherStreamingCameraViewDefaultData;
    case 'publisher preview screen view':
      return publisherPreviewScreenViewDefaultData;
    case 'publisher streaming screen view':
      return publisherStreamingScreenViewDefaultData;
    default:
      throw Error(`Invalid view name ${viewName}`);
  }
};

export const getDefaultHeaderData = (headerName: string) => {
  switch (headerName) {
    case 'publisher preview header':
      return publisherPreviewHeaderData;
    case 'publisher streaming header':
      return publisherStreamingHeaderData;
    default:
      throw Error(`Invalid header name ${headerName}`);
  }
};

export const getDefaultFooterData = (headerName: string) => {
  switch (headerName) {
    case 'publisher preview footer':
      return publisherPreviewFooterData;
    case 'publisher streaming footer':
      return publisherStreamingFooterData;
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
    case 'publisher streaming camera view':
      return publisherStreamingCameraViewConfigureSettings;
    case 'publisher streaming screen view':
      return publisherStreamingScreenViewConfigureSettings;
    case 'publisher streaming local file view':
      return publisherStreamingLocalFileViewConfigureSettings;
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
    case 'publisher streaming camera view':
      return publisherStreamingCameraViewSettingsData;
    case 'publisher streaming screen view':
      return publisherStreamingScreenViewSettingsData;
    default:
      throw Error(`Invalid view name ${viewName}`);
  }
};

export const getDefaultStatsData = (viewName: string) => {
  switch (viewName) {
    case 'publisher streaming camera view':
      return publisherCameraViewStatsData;
    case 'publisher streaming screen view':
      return publisherScreenViewStatsData;
    default:
      throw Error(`Invalid view name ${viewName}`);
  }
};
