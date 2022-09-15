import assert from '../assert.js';
import type {Disposable} from '../disposable.js';
import {queueUpdate} from './global.js';

export type PageStateEvents = {
	onKeyDown?(this: PageStateNode, event: KeyboardEvent): boolean;
	onFocusIn?(this: PageStateNode, event: FocusEvent): boolean;
};

export type PageStateHooks = PageStateEvents;

export class PageStateNode implements Disposable {
	private _child: PageStateNode | undefined;
	private disposed = false;
	private connected = false;

	get child(): PageStateNode | undefined {
		return this._child;
	}

	set child(value: PageStateNode | undefined) {
		if (this.child !== value) {
			this.child?.dispose();
		}

		assert(
			!value || value.parent === this,
			'child node has an incorrect parent',
		);

		this._child = value;

		if (this.connected) {
			queueUpdate();
		}
	}

	constructor(
		private readonly parent: PageStateNode | undefined,
		private readonly hooks: PageStateHooks,
	) {
		if (!parent || parent.connected) {
			this.connected = true;
		}
	}

	dispose() {
		assert(this.parent, 'cannot dispose the root PageStateNode');

		if (this.disposed) {
			return;
		}

		this.child = undefined;
		this.parent._child = undefined;
		this.disposed = true;
		this.connected = false;
	}

	hasEvent(name: keyof PageStateEvents): boolean {
		return name in this.hooks || Boolean(this.child?.hasEvent(name));
	}

	dispatchEvent<K extends keyof PageStateEvents>(
		name: K,
		...args: Parameters<NonNullable<PageStateEvents[K]>>
	): boolean {
		return (
			Boolean(this.child?.dispatchEvent(name, ...args)) ||
			Boolean(this.hooks[name]?.apply(this, args))
		);
	}
}
