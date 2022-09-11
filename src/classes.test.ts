import {describe, expect, it} from 'vitest';
import {classes} from './classes.js';

describe('classes', () => {
	it('returns the correct class names', () => {
		expect(classes()).toBe('');
		expect(classes('a')).toBe('a');
		expect(classes('a', 'b')).toBe('a b');
	});

	it('ignores the undefined class names', () => {
		expect(classes(undefined)).toBe('');
		expect(classes(undefined, 'a', undefined)).toBe('a');
		expect(classes('a', undefined, 'b', undefined)).toBe('a b');
	});
});
