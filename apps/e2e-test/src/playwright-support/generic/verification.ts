import { logger } from '../../logger';
import assert from 'assertion';

export const verifyMatch = (
  actual: string,
  expPattern: string,
  options?: { negate?: boolean; message?: string }
): void => {
  const { negate = false, message = '' } = options || {};
  const msg = `${message}\n\tExpected RegEx: ${expPattern}\n\tActual: ${actual}`;
  logger.trace(`Verify text should ${negate ? ' not' : ''} match to ${expPattern}`);
  const regExp = new RegExp(expPattern, 'i');
  if (negate) {
    assert.hasNot(actual, regExp, msg);
  } else {
    assert.has(actual, regExp, msg);
  }
};

export const verifyEqualTo = (
  actual: unknown,
  expected: unknown,
  options?: { negate?: boolean; message?: string }
): void => {
  const { negate = false, message = '' } = options || {};
  logger.trace(`Verify ${actual} should ${negate ? ' not' : ''} be equal to ${expected}`);
  if (negate) {
    assert.notEqual(actual, expected, message);
  } else {
    assert.equal(actual, expected, message);
  }
};

export const verifyGreaterThanEqualTo = (
  actual: number,
  expected: number,
  options?: { negate?: boolean; message?: string }
): void => {
  const { negate = false, message = '' } = options || {};
  logger.trace(`Verify ${actual} should ${negate ? ' not' : ''} be greater than equal to ${expected}`);
  if (negate) {
    assert.lessThan(actual, expected, message);
  } else {
    assert.greaterThanOrEqual(actual, expected, message);
  }
};

export const verifyLessThanEqualTo = (
  actual: number,
  expected: number,
  options?: { negate?: boolean; message?: string }
): void => {
  const { negate = false, message = '' } = options || {};
  logger.trace(`Verify ${actual} should ${negate ? ' not' : ''} be less than equal to ${expected}`);
  if (negate) {
    assert.greaterThan(actual, expected, message);
  } else {
    assert.lessThanOrEqaul(actual, expected, message);
  }
};

export const verifyLessThan = (
  actual: number,
  expected: number,
  options?: { negate?: boolean; message?: string }
): void => {
  const { negate = false, message = '' } = options || {};
  logger.trace(`Verify ${actual} should ${negate ? ' not' : ''} be less than ${expected}`);
  if (negate) {
    assert.greaterThan(actual, expected, message);
  } else {
    assert.lessThan(actual, expected, message);
  }
};

export const verifyArrayContains = (
  actualArray: string[] | number[],
  expected: string | number | string[] | number[],
  options?: { negate?: boolean; message?: string }
): void => {
  const { negate = false, message = '' } = options || {};
  const msg = `${message}\n\tExpected Item: ${expected}\n\tActualArray: ${actualArray}`;
  logger.trace(`Verify array should ${negate ? ' not' : ''} contains ${expected}`);
  if (negate) {
    assert.hasNot(actualArray, expected, msg);
  } else {
    assert.has(actualArray, expected, msg);
  }
};
