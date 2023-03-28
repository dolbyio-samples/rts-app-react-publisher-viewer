/* eslint-disable func-names */
import { Then } from '@cucumber/cucumber';

import { ScenarioWorld } from '../../hooks/ScenarioWorld';
import { getData, saveData } from '../../hooks/utils';
import { readClipboardText } from '../../playwright-support/generic/clipboard-actions';
import {
  verifyEqualTo,
  verifyMatch,
  verifyNotEqualTo,
  verifyNotMatch,
} from '../../playwright-support/generic/verification';
import { replacePlaceholder } from './utils';

Then(
  /^store the copied clipboard text in "([^"]*)" variable$/,
  async function (this: ScenarioWorld, variableName: string) {
    saveData(this, variableName, readClipboardText());
  }
);

Then(
  /^the copied clipboard text should( not)? contain "([^"]*)"$/,
  async function (this: ScenarioWorld, negate: string, expRegex: string) {
    const clipboardText = readClipboardText();
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
    const clipboardText = readClipboardText();
    const expText = getData(this, variableName);
    const message = 'Clipboard text verification failed';
    if (!negate) {
      await verifyEqualTo(clipboardText, expText, message);
    } else {
      await verifyNotEqualTo(clipboardText, expText, message);
    }
  }
);
