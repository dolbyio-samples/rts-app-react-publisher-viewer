import { generate, Options } from 'cucumber-html-reporter';

import { autName, testReportTitle } from '../config/defaults';
import { BrowserManager } from '../playwright-support/utils/BrowserManager';

const browserMgr = new BrowserManager();

const reportOptions: Options = {
  brandTitle: autName,
  jsonFile: `${browserMgr.options.reportPath}/cucumber_report.json`,
  launchReport: false,
  metadata: {
    'App Version': '2.0.1',
    Browser: `${browserMgr.options.browserName}`,
    Headless: `${browserMgr.options.headless}`,
    Platform: `${process.platform}`,
    'Test Environment': 'DEV',
    Time: `${new Date()}`,
    Viewport: `${browserMgr.options.viewport.width} x ${browserMgr.options.viewport.height}`,
  },
  name: testReportTitle,
  noInlineScreenshots: true,
  output: `${browserMgr.options.reportPath}/cucumber_report.html`,
  reportSuiteAsScenarios: true,
  scenarioTimestamp: true,
  screenshotsDirectory: `${browserMgr.options.reportPath}/screenshots`,
  storeScreenshots: true,
  theme: 'bootstrap',
};

generate(reportOptions);
