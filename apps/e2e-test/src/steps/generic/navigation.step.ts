/* eslint-disable func-names */
import { Then } from '@cucumber/cucumber';

import { ScenarioWorld } from '../../hooks/ScenarioWorld';
import { refresh } from '../../playwright-support/generic/browser-actions';

Then(/^(?:the .*|I) should be navigated to "([^"]*)" page$/, async function (this: ScenarioWorld, pageName: string) {
  this.currentPageName = pageName;
});

Then(/^(?:the .*|I) refresh the "([^"]*)" page$/, async function (this: ScenarioWorld) {
  refresh(this.currentPage);
});
