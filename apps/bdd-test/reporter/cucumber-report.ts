import { generate, Options } from 'cucumber-html-reporter';

import { options } from '../playwright.config';

const reportOptions: Options = {
  theme: 'bootstrap',
  jsonFile: `${options.reportPath}/cucumber_report.json`,
  output: `${options.reportPath}/cucumber_report.html`,
  screenshotsDirectory: `${options.reportPath}/screenshots`,
  storeScreenshots: true,
  reportSuiteAsScenarios: true,
  scenarioTimestamp: true,
  launchReport: false,
  metadata: {
    'App Version': '0.0.1',
    'Test Environment': 'DEV',
    Browser: `${options.browserName}`,
    Platform: `${process.platform}`,
    Time: `${new Date()}`,
  },
};

generate(reportOptions);
