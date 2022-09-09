import {describe, expect, it} from 'vitest';
import assert from './assert.js';

describe('assert', () => {
	it('returns if truthy', () => {
		assert(true, 'Some message here');
	});

	it('throws if falsy', () => {
		expect(() => {
			assert(false, 'Some message here');
		}).toThrowError('Some message here');
	});
});
