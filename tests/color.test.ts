import assert from 'node:assert/strict';
import test from 'node:test';

import { getContrastTextColor } from '../src/utils/color.js';

void test('returns dark text for bright backgrounds', () => {
  assert.equal(getContrastTextColor('#ffffff'), '#1a1a1a');
  assert.equal(getContrastTextColor('#f1f1f1'), '#1a1a1a');
});

void test('returns light text for dark backgrounds', () => {
  assert.equal(getContrastTextColor('#000000'), '#ffffff');
  assert.equal(getContrastTextColor('#2d3138'), '#ffffff');
});
