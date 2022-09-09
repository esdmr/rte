import {describe, expect, it} from 'vitest';
import {useClass} from './use-class.js';

describe('useClass', () => {
	it('returns the correct class names', () => {
		expect(useClass()).toBe('');
		expect(useClass('a')).toBe('a');
		expect(useClass('a', 'b')).toBe('a b');
	});

	it('ignores the undefined class names', () => {
		expect(useClass(undefined)).toBe('');
		expect(useClass(undefined, 'a', undefined)).toBe('a');
		expect(useClass('a', undefined, 'b', undefined)).toBe('a b');
	});
});
