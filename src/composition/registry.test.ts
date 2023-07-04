import {describe, expect, it} from 'vitest';
import {compNodeOfElement} from './registry.js';

describe('compNodeOfElement', () => {
	it('is a WeakMap', () => {
		expect(compNodeOfElement).toBeInstanceOf(WeakMap);
	});
});
