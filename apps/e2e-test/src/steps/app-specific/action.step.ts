/* eslint-disable func-names */
import { When } from '@cucumber/cucumber';

import { ScenarioWorld } from '../../hooks/ScenarioWorld';
import {
  selectSettingDropdown,
  toogleDevice,
  toogleSimulcast,
} from '../../playwright-support/app-specific/element-action';
import { Status } from '../../utils/types';

When(
  /^the publisher turns (Off|On) the "([^"]*)"$/,
  async function (this: ScenarioWorld, status: Status, selectorName: string) {
    const targetSelector = this.selectorMap.getSelector(this.currentPageName, selectorName);
    await toogleDevice(this.currentPage, targetSelector, status);
  }
);

When(
  /^(?:the publisher|I) turns (Off|On) the "([^"]*)" feature$/,
  async function (this: ScenarioWorld, status: Status, selectorName: string) {
    const targetSelector = this.selectorMap.getSelector(this.currentPageName, selectorName);
    const clickSelector = this.selectorMap.getSelector(this.currentPageName, 'simulcast label');
    await toogleSimulcast(this.currentPage, targetSelector, clickSelector, status);
  }
);

When(
  /^the (?:publisher|viewer) selects "([^"]*)" option from the "([^"]*)"$/,
  async function (this: ScenarioWorld, option: string, selectorName: string) {
    const targetSelector = this.selectorMap.getSelector(this.currentPageName, selectorName);
    const OptionsSelector = this.selectorMap.getSelector(this.currentPageName, `${selectorName} options`);
    await selectSettingDropdown(this.currentPage, targetSelector, OptionsSelector, option);
  }
);
