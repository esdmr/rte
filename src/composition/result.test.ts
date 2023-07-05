import {describe, expect, it} from 'vitest';
import {Result, type Resolution} from './result.js';

describe('Result', () => {
	describe('promise', () => {
		it('is a promise', () => {
			expect(new Result().promise).toBeInstanceOf(Promise);
		});
	});

	describe('state', () => {
		it('returns pending at start', () => {
			expect(new Result().state).toBe<Resolution>('pending');
		});
	});

	describe('value', () => {
		it('throws if pending', () => {
			const result = new Result();

			expect(() => result.value).toThrowErrorMatchingInlineSnapshot(
				'"Assertion failed: Result is pending and not fulfilled"',
			);
		});

		it('throws if rejected via reject', () => {
			const result = new Result();
			result.promise.catch(() => undefined);
			result.reject();

			expect(() => result.value).toThrowErrorMatchingInlineSnapshot(
				'"Assertion failed: Result is rejected and not fulfilled"',
			);
		});

		it('throws if rejected via abort', () => {
			const result = new Result();
			result.promise.catch(() => undefined);
			result.abort();

			expect(() => result.value).toThrowErrorMatchingInlineSnapshot(
				'"Assertion failed: Result is rejected and not fulfilled"',
			);
		});
	});

	describe('reason', () => {
		it('throws if pending', () => {
			const result = new Result();

			expect(() => result.reason).toThrowErrorMatchingInlineSnapshot(
				'"Assertion failed: Result is pending and not rejected"',
			);
		});

		it('throws if fulfilled', () => {
			const result = new Result<void>();
			result.resolve();

			expect(() => result.reason).toThrowErrorMatchingInlineSnapshot(
				'"Assertion failed: Result is fulfilled and not rejected"',
			);
		});
	});

	describe('resolve', () => {
		it('throws if fulfilled', () => {
			const result = new Result<void>();
			result.resolve();

			expect(() => {
				result.resolve();
			}).toThrowErrorMatchingInlineSnapshot(
				'"Assertion failed: Result is fulfilled and not pending"',
			);
		});

		it('throws if rejected via reject', () => {
			const result = new Result<void>();
			result.promise.catch(() => undefined);
			result.reject();

			expect(() => {
				result.resolve();
			}).toThrowErrorMatchingInlineSnapshot(
				'"Assertion failed: Result is rejected and not pending"',
			);
		});

		it('throws if rejected via abort', () => {
			const result = new Result<void>();
			result.promise.catch(() => undefined);
			result.abort();

			expect(() => {
				result.resolve();
			}).toThrowErrorMatchingInlineSnapshot(
				'"Assertion failed: Result is rejected and not pending"',
			);
		});

		it('sets state to fulfilled', () => {
			const result = new Result<void>();
			result.resolve();
			expect(result.state).toBe<Resolution>('fulfilled');
		});

		it('sets value', () => {
			const result = new Result<symbol>();
			const symbol = Symbol('Test');
			result.resolve(symbol);
			expect(result.value).toBe(symbol);
		});

		it('resolves the promise', async () => {
			const result = new Result<symbol>();
			const symbol = Symbol('Test');
			result.resolve(symbol);
			await expect(result.promise).resolves.toBe(result.value);
		});
	});

	describe('reject', () => {
		it('throws if fulfilled', () => {
			const result = new Result<void>();
			result.resolve();

			expect(() => {
				result.reject();
			}).toThrowErrorMatchingInlineSnapshot(
				'"Assertion failed: Result is fulfilled and not pending"',
			);
		});

		it('throws if rejected via reject', () => {
			const result = new Result();
			result.promise.catch(() => undefined);
			result.reject();

			expect(() => {
				result.reject();
			}).toThrowErrorMatchingInlineSnapshot(
				'"Assertion failed: Result is rejected and not pending"',
			);
		});

		it('throws if rejected via abort', () => {
			const result = new Result();
			result.promise.catch(() => undefined);
			result.abort();

			expect(() => {
				result.reject();
			}).toThrowErrorMatchingInlineSnapshot(
				'"Assertion failed: Result is rejected and not pending"',
			);
		});

		it('sets state to rejected', () => {
			const result = new Result();
			result.promise.catch(() => undefined);
			result.reject();
			expect(result.state).toBe<Resolution>('rejected');
		});

		it('sets reason', () => {
			const result = new Result();
			result.promise.catch(() => undefined);
			const error = new Error('Test');
			result.reject(error);
			expect(result.reason).toBe(error);
		});

		it('rejects the promise', async () => {
			const result = new Result();
			result.promise.catch(() => undefined);
			const error = new Error('Test');
			result.reject(error);
			await expect(result.promise).rejects.toBe(result.reason);
		});
	});

	describe('abort', () => {
		it('throws if fulfilled', () => {
			const result = new Result<void>();
			result.resolve();

			expect(() => {
				result.abort();
			}).toThrowErrorMatchingInlineSnapshot(
				'"Assertion failed: Result is fulfilled and not pending"',
			);
		});

		it('throws if rejected via reject', () => {
			const result = new Result();
			result.promise.catch(() => undefined);
			result.reject();

			expect(() => {
				result.abort();
			}).toThrowErrorMatchingInlineSnapshot(
				'"Assertion failed: Result is rejected and not pending"',
			);
		});

		it('throws if rejected via abort', () => {
			const result = new Result();
			result.promise.catch(() => undefined);
			result.abort();

			expect(() => {
				result.abort();
			}).toThrowErrorMatchingInlineSnapshot(
				'"Assertion failed: Result is rejected and not pending"',
			);
		});

		it('sets state to rejected', () => {
			const result = new Result();
			result.promise.catch(() => undefined);
			result.abort();
			expect(result.state).toBe<Resolution>('rejected');
		});

		it('sets reason', () => {
			const result = new Result();
			result.promise.catch(() => undefined);
			const random = String(Math.random());

			result.abort({
				toString() {
					return random;
				},
			});

			expect(result.reason).toBeInstanceOf(DOMException);
			expect((result.reason as DOMException)?.name).toBe('AbortError');
			expect((result.reason as DOMException)?.message).toBe(random);
		});

		it('rejects the promise', async () => {
			const result = new Result();
			result.promise.catch(() => undefined);
			const error = new Error('Test');
			result.abort(error);
			await expect(result.promise).rejects.toBe(result.reason);
		});
	});
});
