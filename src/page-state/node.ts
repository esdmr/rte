import assert from '../assert.js';
import type {Disposable} from '../disposable.js';
import type {InputGuideEntry} from '../InputGuide.js';
import type {GamepadClone} from './gamepad.js';
import {queueUpdate} from './update.js';

export type PageStateEvents = {
	onKeyDown?(this: PageStateNode, event: KeyboardEvent): boolean;
	onFocusIn?(this: PageStateNode, event: FocusEvent): boolean;
	onGamepad?(this: PageStateNode, gamepads: readonly GamepadClone[]): boolean;
};

export type PageStateHooks = PageStateEvents & {
	applyInputGuideEntries?(
		this: PageStateNode,
		entries: InputGuideEntry[],
	): void;
};

export class PageStateNode implements Disposable {
	protected connected = false;
	private disposed = false;
	private _child: PageStateNode | undefined;

	get child() {
		return this._child;
	}

	set child(value) {
		if (this.child === value) {
			return;
		}

		this.child?.dispose();

		if (value) {
			assert(!value.disposed, 'child node is disposed');
			assert(value.parent === this, 'child node has an incorrect parent');
		}

		this._child = value;

		if (this.connected) {
			queueUpdate();
		}
	}

	private _title = '';

	get title() {
		return this._title;
	}

	set title(value) {
		if (this._title === value) {
			return;
		}

		this._title = value;

		if (this.connected) {
			queueUpdate();
		}
	}

	constructor(
		private readonly parent: PageStateNode | undefined,
		protected readonly hooks: PageStateHooks,
		readonly root: HTMLElement = parent?.root ?? document.body,
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

		if (this.connected) {
			queueUpdate();
		}

		this.child = undefined;
		this.parent._child = undefined;
		this.disposed = true;
		this.connected = false;
	}

	listTitles(): readonly string[] {
		return [...(this._child?.listTitles() ?? []), this.title];
	}

	applyInputGuideEntries(entries: InputGuideEntry[]) {
		this.hooks.applyInputGuideEntries?.call(this, entries);
		this.child?.applyInputGuideEntries(entries);
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
