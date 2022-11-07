import { generate, Options } from 'cucumber-html-reporter';

import { BrowserManager } from '../support/BrowserManager';

const browserMgr = new BrowserManager();

const reportOptions: Options = {
  theme: 'bootstrap',
  jsonFile: `${browserMgr.options.reportPath}/cucumber_report.json`,
  output: `${browserMgr.options.reportPath}/cucumber_report.html`,
  screenshotsDirectory: `${browserMgr.options.reportPath}/screenshots`,
  storeScreenshots: true,
  reportSuiteAsScenarios: true,
  scenarioTimestamp: true,
  launchReport: false,
  metadata: {
    'App Version': '0.0.1',
    'Test Environment': 'DEV',
    Browser: `${browserMgr.options.browserName}`,
    Headless: `${browserMgr.options.headless}`,
    Viewport: `${browserMgr.options.viewport.width} x ${browserMgr.options.viewport.height}`,
    Platform: `${process.platform}`,
    Time: `${new Date()}`,
  },
};

generate(reportOptions);
