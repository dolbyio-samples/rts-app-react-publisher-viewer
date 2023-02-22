/* eslint-disable func-names */
import { When } from '@cucumber/cucumber';
import { defaultReportPath } from '../../config/defaults';

import { ScenarioWorld } from '../../hooks/ScenarioWorld';
import { check, click, hover, takeScreenshot, uncheck } from '../../playwright-support/generic/element-action';
import { TargetSelector } from '../../utils/selector-mapper';
import { replaceAttributeTargetSelector } from './utils';

When(
  /^(?:the .*|I) (?:clicks|click) on the( "([0-9]+th|[0-9]+st|[0-9]+nd|[0-9]+rd)")? "([^"]*)"$/,
  async function (this: ScenarioWorld, elementPosition: string, selectorName: string) {
    const targetSelector = this.selectorMap.getSelector(this.currentPageName, selectorName);
    const elementIndex = elementPosition != null ? Number(elementPosition.match(/\d/g)?.join('')) - 1 : undefined;
    await click(this.currentPage, targetSelector, elementIndex);
  }
);

When(
  /^(?:the .*|I) (?:clicks|click) on the "([^"]*)" with locator attribute "([^"]*)"$/,
  async function (this: ScenarioWorld, selectorName: string, attributeValue: string) {
    let targetSelector = this.selectorMap.getSelector(this.currentPageName, selectorName);
    targetSelector = replaceAttributeTargetSelector(targetSelector, attributeValue);
    await click(this.currentPage, targetSelector);
  }
);

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

When(
  /^(?:the .*|I) hovers the mouse over the( "([0-9]+th|[0-9]+st|[0-9]+nd|[0-9]+rd)")? "([^"]*)"$/,
  async function (this: ScenarioWorld, elementPosition: string, selectorName: string) {
    const targetSelector = this.selectorMap.getSelector(this.currentPageName, selectorName);
    const elementIndex = elementPosition != null ? Number(elementPosition.match(/\d/g)?.join('')) - 1 : undefined;
    await hover(this.currentPage, targetSelector, elementIndex);
  }
);

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
