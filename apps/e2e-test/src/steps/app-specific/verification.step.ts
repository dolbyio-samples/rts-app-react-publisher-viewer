/* eslint-disable func-names */
import { Then } from '@cucumber/cucumber';

import { ScenarioWorld } from '../../hooks/ScenarioWorld';
import {
  verifyDeviceStatus,
  verifyOptions,
  verifyViewScreenSize,
} from '../../playwright-support/app-specific/element-verification';
import { verifyElementState } from '../../playwright-support/generic/element-verification';
import { waitFor } from '../../playwright-support/generic/element-wait';
import { Screen, Status } from '../../utils/types';

Then(
  /^the "([^"]*)" should( not)? be in (Full|Normal) size$/,
  async function (this: ScenarioWorld, selectorName: string, negate: string, screenSize: Screen) {
    const targetSelector = this.selectorMap.getSelector(this.currentPageName, selectorName);
    const verifyMethod = async () => {
      await verifyViewScreenSize(this.currentPage, targetSelector, screenSize, !!negate);
    };
    await waitFor(verifyMethod);
  }
);

Then(
  /^the "([^"]*)" should( not)? be turned (On|Off)$/,
  async function (this: ScenarioWorld, selectorName: string, negate: string, status: Status) {
    const targetSelector = this.selectorMap.getSelector(this.currentPageName, selectorName);
    const verifyMethod = async () => {
      await verifyDeviceStatus(this.currentPage, targetSelector, status, !!negate);
    };
    await waitFor(verifyMethod);
  }
);

Then(
  /^the "([^"]*)" should( not)? contain "([^"]*)" options$/,
  async function (this: ScenarioWorld, selectorName: string, negate: string, options: string) {
    const targetSelector = this.selectorMap.getSelector(this.currentPageName, selectorName);
    const verifyMethod = async () => {
      await verifyOptions(this.currentPage, targetSelector, options.split(','), !!negate);
    };
    await waitFor(verifyMethod);
  }
);

Then(
  /^the "([^"]*)" feature should be turned (On|Off)$/,
  async function (this: ScenarioWorld, selectorName: string, status: Status) {
    const targetSelector = this.selectorMap.getSelector(this.currentPageName, selectorName);
    const negate = status === 'Off';

    const verifyMethod = async () => {
      await verifyElementState(this.currentPage, targetSelector, 'checked', negate);
    };
    await waitFor(verifyMethod);
  }
);
