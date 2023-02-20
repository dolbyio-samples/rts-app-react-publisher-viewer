type ViewData = { [key: string]: string };

const publisherCameraViewDefaultData: ViewData = {
  size: 'Normal',
  'source name': 'displayed',
  'source name text': 'contains: fake',
  'setting button': 'displayed|enabled',
  'microphone button': 'displayed|enabled',
  'microphone button status': 'On',
  'camera button': 'displayed|enabled',
  'camera button status': 'On',
  'stream info button': 'hidden',
  'full screen button': 'hidden',
};

const publisherScreenViewDefaultData: ViewData = {
  size: 'Normal',
  'source name': 'displayed',
  'source name text': 'contains: screen',
  'setting button': 'displayed|enabled',
  'microphone button': 'displayed|enabled',
  'microphone button status': 'On',
  'camera button': 'displayed|enabled',
  'camera button status': 'On',
  'stream info button': 'hidden',
  'full screen button': 'hidden',
};

const publisherPreviewHeaderData: ViewData = {
  'company name': 'displayed',
  'company name text': 'Company name',
  timer: 'displayed',
  'timer text': '00:00:00',
  'page header': 'displayed',
  'page header text': 'Get started',
  'page description': 'displayed',
  'page description text': 'Setup your audio and video before going live.',
  'streaming status dot': 'hidden',
  'viewers count': 'hidden',
  'multi source label': 'hidden',
  'multi source label text': 'ignore: ',
  'go live button': 'displayed|enabled',
  'go live button text': 'GO LIVE',
  'invite button': 'displayed|enabled',
  'invite button text': 'Invite viewers',
};

const publisherStreamingHeaderData: ViewData = {
  'company name': 'displayed',
  'company name text': 'Company name',
  timer: 'displayed',
  'timer text': 'regex: ^((?!00:00:00).)*$',
  'page header': 'hidden',
  'page description': 'hidden',
  'streaming status dot': 'displayed',
  'viewers count': 'displayed',
  'viewers count text': '0 Viewers',
  'multi source label': 'hidden',
  'multi source label text': 'ignore: ',
  'stop button': 'displayed|enabled',
  'stop button text': 'STOP',
  'invite button': 'displayed|enabled',
  'invite button text': 'Invite viewers',
};

const publisherCameraViewSettings: ViewData = {
  'source name': 'ignore: ',
  resolution: '3840x2160',
  bitrate: 'Auto',
  simulcast: 'On',
  codec: 'h264',
};

const publisherScreenViewSettings: ViewData = {
  'source name': 'ignore: ',
  bitrate: 'Auto',
  simulcast: 'On',
  codec: 'h264',
};

const publisherCameraViewSettingsData: ViewData = {
  'source name': 'contains: fake',
  resolution: 'Resolution  - 3840x2160',
  bitrate: 'Bitrate  - Auto',
  simulcast: 'On',
  codec: 'Codec  - h264',
};

const publisherScreenViewSettingsData: ViewData = {
  'source name': 'contains: screen',
  bitrate: 'Bitrate  - Auto',
  simulcast: 'On',
  codec: 'Codec  - h264',
};

const publisherCameraViewStatsData: ViewData = {
  Name: 'Value',
  'Current RTT:': 'regex: \\d{1,3} ms',
  'Outgoing bitrate:': 'regex: ([0-9]*[.])?[0-9]+ (kbps|Mbps)',
  'Candidate type:': 'regex: [s|p]rflx',
  'Video resolution:': 'regex: \\d{3,4}x\\d{3,4}',
  'Quality limitation reason:': 'regex: (bandwidth|cpu|none)',
  'Frames per second:': 'regex: \\d{1,2}',
  'Video bitrate:': 'regex: ([0-9]*[.])?[0-9]+(bps| kbps| Mbps)',
  'Audio bitrate:': 'regex: ([0-9]*[.])?[0-9]+(bps| kbps| Mbps)',
  'Video total sent:': 'regex: ([0-9]*[.])?[0-9]+ (KB|MB)',
  'Audio total sent:': 'regex: ([0-9]*[.])?[0-9]+ (KB|MB)',
  'Codecs:': 'video/H264, audio/opus',
  'Timestamp:':
    'regex: (([1-9]|1[0-2])/([1-9]|0[1-9]|[1-2][0-9]|3[0-1])/[0-9]{4} ([1-9]|[1][0-2]):([0-5][0-9]|[0-9]):([0-5][0-9]|[0-9]) [A|P]M)|((0[1-9]|[1-2][0-9]|3[0-1])/(0[1-9]|1[0-2])/[0-9]{4} (2[0-3]|[01][0-9]|[0-9]):([0-5][0-9]|[0-9]):([0-5][0-9]))',
};

const publisherScreenViewStatsData: ViewData = {
  Name: 'Value',
  'Current RTT:': 'regex: \\d{1,3} ms',
  'Outgoing bitrate:': 'regex: ([0-9]*[.])?[0-9]+ (kbps|Mbps)',
  'Candidate type:': 'regex: [s|p]rflx',
  'Video resolution:': 'regex: \\d{3,4}x\\d{3,4}',
  'Quality limitation reason:': 'regex: (bandwidth|cpu|none)',
  'Frames per second:': 'regex: \\d{1,2}',
  'Video bitrate:': 'regex: ([0-9]*[.])?[0-9]+(bps| kbps| Mbps)',
  'Audio bitrate:': 'regex: ([0-9]*[.])?[0-9]+(bps| kbps| Mbps)',
  'Video total sent:': 'regex: ([0-9]*[.])?[0-9]+ (KB|MB)',
  'Audio total sent:': 'regex: ([0-9]*[.])?[0-9]+ (KB|MB)',
  'Codecs:': 'video/H264, audio/opus',
  'Timestamp:':
    'regex: (([1-9]|1[0-2])/([1-9]|0[1-9]|[1-2][0-9]|3[0-1])/[0-9]{4} ([1-9]|[1][0-2]):([0-5][0-9]|[0-9]):([0-5][0-9]|[0-9]) [A|P]M)|((0[1-9]|[1-2][0-9]|3[0-1])/(0[1-9]|1[0-2])/[0-9]{4} (2[0-3]|[01][0-9]|[0-9]):([0-5][0-9]|[0-9]):([0-5][0-9]))',
};

export const getDefaultViewData = (viewName: string) => {
  switch (viewName) {
    case 'publisher camera view':
      return publisherCameraViewDefaultData;
    case 'publisher screen view':
      return publisherScreenViewDefaultData;
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

export const getDefaultSettings = (viewName: string) => {
  switch (viewName) {
    case 'publisher camera view':
      return publisherCameraViewSettings;
    case 'publisher screen view':
      return publisherScreenViewSettings;
    default:
      throw Error(`Invalid view name ${viewName}`);
  }
};

export const getDefaultSettingsData = (viewName: string) => {
  switch (viewName) {
    case 'publisher camera view':
      return publisherCameraViewSettingsData;
    case 'publisher screen view':
      return publisherScreenViewSettingsData;
    default:
      throw Error(`Invalid view name ${viewName}`);
  }
};

export const getDefaultStatsData = (viewName: string) => {
  switch (viewName) {
    case 'publisher camera view':
      return publisherCameraViewStatsData;
    case 'publisher screen view':
      return publisherScreenViewStatsData;
    default:
      throw Error(`Invalid view name ${viewName}`);
  }
};
