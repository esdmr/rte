import {describe, expect, it} from 'vitest';
import {compNodeOfElement, getCompNodeOf} from './registry.js';
import {CompLayer} from './layer.js';

describe('compNodeOfElement', () => {
	it('is a WeakMap', () => {
		expect(compNodeOfElement).toBeInstanceOf(WeakMap);
	});
});

describe('getCompNodeOf', () => {
	it('returns undefined if input is null', () => {
		expect(getCompNodeOf(null, 'test')).toBeUndefined();
	});

	it('throws if input is not a comp element', () => {
		const element = document.createElement('div');

		expect(() =>
			getCompNodeOf(element, 'test'),
		).toThrowErrorMatchingInlineSnapshot(
			'"Assertion failed: Child of test is not a compositor node"',
		);
	});

	it('returns the node associated with the element', () => {
		const node = new CompLayer();
		expect(getCompNodeOf(node._element, 'test')).toBe(node);
	});
});
