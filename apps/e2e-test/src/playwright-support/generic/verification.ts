import { expect } from '@playwright/test';
import { logger } from '../../logger';

export const verifyTextMatch = (actText: string, expPattern: string, negate = false): void => {
  logger.trace(`Verify text should ${negate ? ' not' : ''} match to ${expPattern}`);
  const regExp = new RegExp(expPattern, 'i');
  if (negate) {
    expect(actText).not.toMatch(regExp);
  } else {
    expect(actText).toMatch(regExp);
  }
};

export const verifyText = (actText: string, expText: string, negate = false): void => {
  logger.trace(`Verify text should ${negate ? ' not' : ''} be equal to ${expText}`);
  if (negate) {
    expect(actText).not.toEqual(expText);
  } else {
    expect(actText).toEqual(expText);
  }
};

export const verifyCount = (actCount: number, expCount: number, negate = false): void => {
  logger.trace(`Verify count should ${negate ? ' not' : ''} be equal to ${expCount}`);
  if (negate) {
    expect(actCount).not.toEqual(expCount);
  } else {
    expect(actCount).toEqual(expCount);
  }
};

export const verifyGreaterThanEqualTo = (actCount: number, expCount: number, negate = false): void => {
  logger.trace(`Verify count should ${negate ? ' not' : ''} be greater than equal to ${expCount}`);
  if (negate) {
    expect(actCount).not.toBeGreaterThanOrEqual(expCount);
  } else {
    expect(actCount).toBeGreaterThanOrEqual(expCount);
  }
};

export const verifyArrayContains = (array: string[], expKey: string, negate = false): void => {
  logger.trace(`Verify array should ${negate ? ' not' : ''} contains key ${expKey}`);
  if (negate) {
    expect(array).not.toContain(expKey);
  } else {
    expect(array).toContain(expKey);
  }
};
