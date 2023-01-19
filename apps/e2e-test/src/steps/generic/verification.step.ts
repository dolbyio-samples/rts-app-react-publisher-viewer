/* eslint-disable func-names */
import { Then } from '@cucumber/cucumber';

import { ScenarioWorld } from '../../hooks/ScenarioWorld';
import {
  verifyElementContainsText,
  verifyElementCount,
  verifyElementState,
  verifyElementText,
  verifyElementValue,
} from '../../playwright-support/generic/element-verification';
import { waitFor } from '../../playwright-support/generic/element-wait';
import { State } from '../../utils/types';

Then(
  /^the( "([0-9]+th|[0-9]+st|[0-9]+nd|[0-9]+rd)")? "([^"]*)" should( not)? be (displayed|visible|invisible|hidden|enabled|disabled|editable|checked|selected)$/,
  async function (this: ScenarioWorld, elementPosition: string, selectorName: string, negate: string, state: string) {
    const targetSelector = this.selectorMap.getSelector(this.currentPageName, selectorName);
    const elementIndex = elementPosition != null ? Number(elementPosition.match(/\d/g)?.join('')) - 1 : undefined;
    const verifyMethod = async () => {
      await verifyElementState(this.currentPage, targetSelector, state as State, !!negate, elementIndex);
    };
    await waitFor(verifyMethod);
  }
);

Then(
  /^the "([^"]*)" text should( not)? be "([^"]*)"$/,
  async function (this: ScenarioWorld, selectorName: string, negate: string, text: string) {
    const targetSelector = this.selectorMap.getSelector(this.currentPageName, selectorName);
    const verifyMethod = async () => {
      await verifyElementText(this.currentPage, targetSelector, text, !!negate);
    };
    await waitFor(verifyMethod);
  }
);

Then(
  /^the "([^"]*)" text should( not)? contain "([^"]*)"$/,
  async function (this: ScenarioWorld, selectorName: string, negate: string, text: string) {
    const targetSelector = this.selectorMap.getSelector(this.currentPageName, selectorName);
    const verifyMethod = async () => {
      await verifyElementContainsText(this.currentPage, targetSelector, text, !!negate);
    };
    await waitFor(verifyMethod);
  }
);

Then(
  /^the "([^"]*)" value should( not)? be "([^"]*)"$/,
  async function (this: ScenarioWorld, selectorName: string, negate: string, text: string) {
    const targetSelector = this.selectorMap.getSelector(this.currentPageName, selectorName);
    const verifyMethod = async () => {
      await verifyElementValue(this.currentPage, targetSelector, text, !!negate);
    };
    await waitFor(verifyMethod);
  }
);

Then(
  /^the number of "([^"]*)" count should( not)? be "([^"]*)"$/,
  async function (this: ScenarioWorld, selectorName: string, negate: string, count: string) {
    const targetSelector = this.selectorMap.getSelector(this.currentPageName, selectorName);
    const verifyMethod = async () => {
      await verifyElementCount(this.currentPage, targetSelector, Number(count), !!negate);
    };
    await waitFor(verifyMethod);
  }
);
