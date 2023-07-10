/* eslint-disable func-names */
import { Then } from '@cucumber/cucumber';
import { readClipboardText } from '../../playwright-support/generic/clipboard-actions';

import { ScenarioWorld } from '../../hooks/ScenarioWorld';
import { replacePlaceholder } from './utils';
import { getData, saveData } from '../../hooks/utils';
import {
  verifyEqualTo,
  verifyMatch,
  verifyNotEqualTo,
  verifyNotMatch,
} from '../../playwright-support/generic/verification';

Then(
  /^store the copied clipboard text in "([^"]*)" variable$/,
  async function (this: ScenarioWorld, variableName: string) {
    saveData(this, variableName, await readClipboardText(this.currentPage));
  }
);

Then(
  /^the copied clipboard text should( not)? contain "([^"]*)"$/,
  async function (this: ScenarioWorld, negate: string, expRegex: string) {
    // console.log(await this.currentPage.evaluate("navigator.clipboard.readText()"))
    const clipboardText = await readClipboardText(this.currentPage);
    const expPattern = replacePlaceholder(expRegex, this);
    const message = 'Clipboard text verification failed';
    if (!negate) {
      await verifyMatch(clipboardText, expPattern, message);
    } else {
      await verifyNotMatch(clipboardText, expPattern, message);
    }
  }
);

Then(
  /^the copied clipboard text should( not)? be equal to the stored "([^"]*)" variable$/,
  async function (this: ScenarioWorld, negate: string, variableName: string) {
    const clipboardText = await readClipboardText(this.currentPage);
    const expText = getData(this, variableName);
    const message = 'Clipboard text verification failed';
    if (!negate) {
      await verifyEqualTo(clipboardText, expText, message);
    } else {
      await verifyNotEqualTo(clipboardText, expText, message);
    }
  }
);
