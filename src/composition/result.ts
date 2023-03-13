import assert from '../assert.js';

export type Resolution = 'pending' | 'fulfilled' | 'rejected';

export class Result<T> {
	readonly promise;
	private _resolve: ((value: T) => void) | undefined;
	private _reject: ((reason?: unknown) => void) | undefined;
	private _state: Resolution = 'pending';
	private _value?: T;
	private _reason?: unknown;

	constructor() {
		this.promise = new Promise<T>((resolve, reject) => {
			this._resolve = resolve;
			this._reject = reject;
		});
	}

	get state() {
		return this._state;
	}

	get value() {
		assert(
			this._state === 'fulfilled',
			`Result is ${this._state} and not fulfilled`,
		);

		return this._value as T;
	}

	get reason() {
		assert(
			this._state === 'rejected',
			`Result is ${this._state} and not rejected`,
		);

		return this._reason;
	}

	resolve(value: T) {
		assert(
			this._state === 'pending',
			`Result is ${this._state} and not pending`,
		);

		this._state = 'fulfilled';
		this._value = value;
		this._resolve!(value);
		this._resolve = undefined;
		this._reject = undefined;
	}

	reject(reason?: unknown) {
		assert(
			this._state === 'pending',
			`Result is ${this._state} and not pending`,
		);

		this._state = 'rejected';
		this._reason = reason;
		this._reject!(reason);
		this._resolve = undefined;
		this._reject = undefined;
	}

	abort(reason?: unknown) {
		this.reject(
			new DOMException(
				reason === undefined ? undefined : String(reason),
				'AbortError',
			),
		);
	}
}
