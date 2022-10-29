import reporter, { Options } from "cucumber-html-reporter";

const options: Options = {
  theme: "bootstrap",
  jsonFile: "./reports/cucumber_report.json",
  output: "./reports/cucumber_report.html",
  screenshotsDirectory: "./reports/screenshots",
  storeScreenshots: true,
  reportSuiteAsScenarios: true,
  scenarioTimestamp: true,
  launchReport: false,
  metadata: {
    "App Version": "2.0.0",
    "Test Environment": "DEV",
    Browser: "Chrome",
    Platform: "MAC",
  },
};

reporter.generate(options);
