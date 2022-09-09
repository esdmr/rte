import {describe, expect, it} from 'vitest';
import history from './history.js';

describe('history', () => {
	it('is an instance of History', () => {
		expect(history).toBeTypeOf('object');
		expect(history.action).toBeTypeOf('string');
		expect(history.back).toBeTypeOf('function');
		expect(history.block).toBeTypeOf('function');
		expect(history.createHref).toBeTypeOf('function');
		expect(history.forward).toBeTypeOf('function');
		expect(history.go).toBeTypeOf('function');
		expect(history.listen).toBeTypeOf('function');
		expect(history.location).toBeTypeOf('object');
		expect(history.location.hash).toBeTypeOf('string');
		expect(history.location.key).toBeTypeOf('string');
		expect(history.location.pathname).toBeTypeOf('string');
		expect(history.location.search).toBeTypeOf('string');
		expect(history.push).toBeTypeOf('function');
		expect(history.replace).toBeTypeOf('function');
	});
});
