import assert from 'node:assert/strict';
import test from 'node:test';

import { emptyToNull, numberToString, orEmpty, parseFloatOrNull } from '../src/utils/form.js';

void test('orEmpty returns empty string for nullish values', () => {
  assert.equal(orEmpty(undefined), '');
  assert.equal(orEmpty(null), '');
});

void test('orEmpty keeps non-empty values', () => {
  assert.equal(orEmpty('abc'), 'abc');
});

void test('numberToString converts numbers and nullish', () => {
  assert.equal(numberToString(42), '42');
  assert.equal(numberToString(0), '0');
  assert.equal(numberToString(null), '');
  assert.equal(numberToString(undefined), '');
});

void test('emptyToNull normalizes empty string', () => {
  assert.equal(emptyToNull(''), null);
  assert.equal(emptyToNull('value'), 'value');
});

void test('parseFloatOrNull parses decimal values and invalid input', () => {
  assert.equal(parseFloatOrNull('3.14'), 3.14);
  assert.equal(parseFloatOrNull('0'), 0);
  assert.equal(parseFloatOrNull('x'), null);
  assert.equal(parseFloatOrNull(''), null);
});
