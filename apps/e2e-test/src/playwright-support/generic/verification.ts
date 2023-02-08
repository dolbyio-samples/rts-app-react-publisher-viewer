import { logger } from '../../logger';
import assert from 'assertion';
import fs from 'fs';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

export const verifyMatch = (actual: string, expPattern: string, message?: string): void => {
  message = `${message || ''}\n\tExpected RegEx: ${expPattern}\n\tActual: ${actual}`;
  logger.trace(`Verify text should match to ${expPattern}`);
  const regExp = new RegExp(expPattern, 'i');
  assert.has(actual, regExp, message);
};

export const verifyNotMatch = (actual: string, expPattern: string, message?: string): void => {
  message = `${message || ''}\n\tExpected RegEx: ${expPattern}\n\tActual: ${actual}`;
  logger.trace(`Verify text should not match to ${expPattern}`);
  const regExp = new RegExp(expPattern, 'i');
  assert.hasNot(actual, regExp, message);
};

export const verifyEqualTo = (actual: unknown, expected: unknown, message?: string): void => {
  message = message || '';
  logger.trace(`Verify ${actual} should be equal to ${expected}`);
  assert.equal(actual, expected, message);
};

export const verifyNotEqualTo = (actual: unknown, expected: unknown, message?: string): void => {
  message = message || '';
  logger.trace(`Verify ${actual} should not be equal to ${expected}`);
  assert.notEqual(actual, expected, message);
};

export const verifyGreaterThanEqualTo = (actual: number, expected: number, message?: string): void => {
  message = message || '';
  logger.trace(`Verify ${actual} should be greater than equal to ${expected}`);
  assert.greaterThanOrEqual(actual, expected, message);
};

export const verifyLessThanEqualTo = (actual: number, expected: number, message?: string): void => {
  message = message || '';
  logger.trace(`Verify ${actual} should be less than equal to ${expected}`);
  assert.lessThanOrEqaul(actual, expected, message);
};

export const verifyLessThan = (actual: number, expected: number, message?: string): void => {
  message = message || '';
  logger.trace(`Verify ${actual} should be less than ${expected}`);
  assert.lessThan(actual, expected, message);
};

export const verifyArrayContains = (
  actualArray: string[] | number[],
  expected: string | number | string[] | number[],
  message?: string
): void => {
  message = `${message || ''}\n\tExpected Item: ${expected}\n\tActualArray: ${actualArray}`;
  logger.trace(`Verify array should contains ${expected}`);
  assert.has(actualArray, expected, message);
};

export function verifyImageEqual(actualImage: string, expectedImage: string, diffOutput: string, threshold = 0.15) {
  const pixelDiffCount = imageCompare(actualImage, expectedImage, diffOutput, threshold);
  const message = `Image comparison failed - ${pixelDiffCount}.\n\tActual Image: ${actualImage}\n\tExpected Image: ${expectedImage}.\n\tDiff Image: ${diffOutput}.`;
  assert.equal(pixelDiffCount, 0, message);
}

export function verifyImageNotEqual(actualImage: string, expectedImage: string, diffOutput: string, threshold = 0.15) {
  const pixelDiffCount = imageCompare(actualImage, expectedImage, diffOutput, threshold);
  const message = `Image comparison failed - ${pixelDiffCount}.\n\tActual Image: ${actualImage}\n\tExpected Image: ${expectedImage}.\n\tDiff Image: ${diffOutput}.`;
  assert.notEqual(pixelDiffCount, 0, message);
}

function imageCompare(actualImage: string, expectedImage: string, diffOutput: string, threshold = 0.15) {
  logger.trace(`Compare image actual: ${actualImage} , expected: ${expectedImage}, and diff Image: ${diffOutput}`);
  const actualImg = PNG.sync.read(fs.readFileSync(actualImage));
  const expectedImg = PNG.sync.read(fs.readFileSync(expectedImage));

  const { width, height } = expectedImg;
  const diff = new PNG({ width, height });

  const numDiffPixels = pixelmatch(expectedImg.data, actualImg.data, diff.data, width, height, {
    threshold: threshold,
  });

  fs.writeFileSync(diffOutput, PNG.sync.write(diff));
  return numDiffPixels;
}
