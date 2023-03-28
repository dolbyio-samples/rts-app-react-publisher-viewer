import { generate, Options } from 'cucumber-html-reporter';

import { autName, testReportTitle } from '../config/defaults';
import { BrowserManager } from '../playwright-support/utils/BrowserManager';

const browserMgr = new BrowserManager();

const reportOptions: Options = {
  theme: 'bootstrap',
  brandTitle: autName,
  name: testReportTitle,
  jsonFile: `${browserMgr.options.reportPath}/cucumber_report.json`,
  output: `${browserMgr.options.reportPath}/cucumber_report.html`,
  screenshotsDirectory: `${browserMgr.options.reportPath}/screenshots`,
  storeScreenshots: true,
  noInlineScreenshots: true,
  reportSuiteAsScenarios: true,
  scenarioTimestamp: true,
  launchReport: false,
  metadata: {
    'App Version': '2.1.0',
    'Test Environment': 'DEV',
    Browser: `${browserMgr.options.browserName}`,
    Headless: `${browserMgr.options.headless}`,
    Viewport: `${browserMgr.options.viewport.width} x ${browserMgr.options.viewport.height}`,
    Platform: `${process.platform}`,
    Time: `${new Date()}`,
  },
};

generate(reportOptions);
