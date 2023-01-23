/* eslint-disable func-names */
import { When } from '@cucumber/cucumber';

import { ScenarioWorld } from '../../hooks/ScenarioWorld';
import { check, click, hover, uncheck } from '../../playwright-support/generic/element-action';

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
