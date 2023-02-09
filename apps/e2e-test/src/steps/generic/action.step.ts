/* eslint-disable func-names */
import { When } from '@cucumber/cucumber';
import { defaultReportPath } from '../../config/defaults';

import { ScenarioWorld } from '../../hooks/ScenarioWorld';
import { check, click, hover, takeScreenshot, uncheck } from '../../playwright-support/generic/element-action';
import { TargetSelector } from '../../utils/selector-mapper';

When(/^(?:the .*|I) (?:clicks|click) on the "([^"]*)"$/, async function (this: ScenarioWorld, selectorName: string) {
  const targetSelector = this.selectorMap.getSelector(this.currentPageName, selectorName);
  await click(this.currentPage, targetSelector);
});

When(
  /^(?:the .*|I) (?:check|checks|select|selects) the "([^"]*)"$/,
  async function (this: ScenarioWorld, selectorName: string) {
    const targetSelector = this.selectorMap.getSelector(this.currentPageName, selectorName);
    await check(this.currentPage, targetSelector);
  }
);

When(
  /^(?:the .*|I) (?:uncheck|unchecks|unselect|unselects) the "([^"]*)"$/,
  async function (this: ScenarioWorld, selectorName: string) {
    const targetSelector = this.selectorMap.getSelector(this.currentPageName, selectorName);
    await uncheck(this.currentPage, targetSelector);
  }
);

When(/^(?:the .*|I) hovers the mouse over the "([^"]*)"$/, async function (this: ScenarioWorld, selectorName: string) {
  const targetSelector = this.selectorMap.getSelector(this.currentPageName, selectorName);
  await hover(this.currentPage, targetSelector);
});

When(
  /^(?:I )?take the screenshot of "([^"]*)" at path "([^"]*)"$/,
  async function (this: ScenarioWorld, selectorName: string, imgName: string) {
    const targetSelector = this.selectorMap.getSelector(this.currentPageName, selectorName);
    const screenshotPath = `${defaultReportPath}/image-compare/${imgName}`;
    await takeScreenshot(this.currentPage, targetSelector, screenshotPath);
  }
);

When(
  /^(?:I )?take the screenshot of "([^"]*)" with mask "([^"]*)" at path "([^"]*)"$/,
  async function (this: ScenarioWorld, selectorName: string, maskSelectorNames: string, imgName: string) {
    const targetSelector = this.selectorMap.getSelector(this.currentPageName, selectorName);
    const screenshotPath = `${defaultReportPath}/image-compare/${imgName}`;
    const targetMaskSelectors: TargetSelector[] = [];
    for (const maskSelector of maskSelectorNames.split(',')) {
      targetMaskSelectors.push(this.selectorMap.getSelector(this.currentPageName, maskSelector));
    }
    await takeScreenshot(this.currentPage, targetSelector, screenshotPath, targetMaskSelectors);
  }
);
