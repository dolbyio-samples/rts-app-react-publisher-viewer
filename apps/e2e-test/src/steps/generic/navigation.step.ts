/* eslint-disable func-names */
import { Then } from '@cucumber/cucumber';

import { ScenarioWorld } from '#e2e-test/src/hooks/ScenarioWorld';
import { refresh } from '#e2e-test/src/playwright-support/generic/browser-actions';
import { verifyElementState } from '#e2e-test/src/playwright-support/generic/element-verification';
import { waitFor } from '#e2e-test/src/playwright-support/generic/element-wait';
import { State } from '#e2e-test/src/utils/types';

import { getValidationCondition } from './utils';

Then(/^(?:the .*|I) should be navigated to "([^"]*)" page$/, async function (this: ScenarioWorld, pageName: string) {
  this.currentPageName = pageName;
  const validationCondition = getValidationCondition(this.selectorMap, pageName);
  const targetSelector = this.selectorMap.getSelector(this.currentPageName, validationCondition.selector);
  const verifyMethod = async () => {
    await verifyElementState(this.currentPage, targetSelector, validationCondition.condition as State);
  };
  await waitFor(verifyMethod);
});

Then(/^(?:the .*|I) refresh the page$/, async function (this: ScenarioWorld) {
  refresh(this.currentPage);
  const validationCondition = getValidationCondition(this.selectorMap, this.currentPageName);
  const targetSelector = this.selectorMap.getSelector(this.currentPageName, validationCondition.selector);
  const verifyMethod = async () => {
    await verifyElementState(this.currentPage, targetSelector, validationCondition.condition as State);
  };
  await waitFor(verifyMethod);
});
