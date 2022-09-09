import {describe, expect, it} from 'vitest';
import {numberToString} from './number-to-string.js';

describe('numberToString', () => {
	it('rounds very small numbers', () => {
		expect(numberToString(1e-21)).toBe('0');
	});

	it('writes small numbers in digits', () => {
		expect(numberToString(1e-20)).toBe('0.00000000000000000001');
	});

	it('writes large numbers in digits', () => {
		expect(numberToString(Number.MAX_VALUE)).toMatch(
			/^179769313486231570{292}$/,
		);
	});

	it('throws if number is infinite or NaN', () => {
		for (const value of [
			Number.NEGATIVE_INFINITY,
			Number.NaN,
			Number.POSITIVE_INFINITY,
		]) {
			expect(() => numberToString(value)).toThrowErrorMatchingSnapshot(
				`${value}`,
			);
		}
	});
});
