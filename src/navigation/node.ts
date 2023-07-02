import assert from '../assert.js';
import type {Disposable} from '../disposable.js';
import {isFocusVisible} from '../focus-visible.js';
import {NavChildToken} from './child-token.js';
import {NavState} from './state.js';

export type NavDirection = 'next' | 'up' | 'down' | 'left' | 'right';

export type NavSelectOptions = {
	readonly focusVisible?: boolean;
};

export type NavHooks = {
	readonly type?: string;
	onNewChild?(this: NavNode): NavChildToken | void;
	onDispose?(this: NavNode): void;
	onSelect?(this: NavNode, options?: NavSelectOptions): void;
	onDeselect?(this: NavNode): void;
	getLeaf?(this: NavNode, via: NavDirection): NavNode | undefined;
	getNextLeaf?(
		this: NavNode,
		child: NavNode,
		dir: NavDirection,
	): NavNode | undefined;
};

export class NavNode implements Disposable {
	static for(childToken: NavChildToken, hooks: NavHooks) {
		const node = new NavNode(childToken.parent, hooks);
		childToken.child = node;
		return node;
	}

	readonly state: NavState;
	readonly children: Array<NavNode | undefined> = [];
	private disposed_ = false;

	get disposed() {
		return this.disposed_;
	}

	get selected() {
		return this.state.selected === this;
	}

	private _ref: HTMLElement | undefined;

	get ref() {
		return this._ref;
	}

	set ref(current: HTMLElement | undefined) {
		if (this._ref !== undefined) {
			this.state.elementToNode.delete(this._ref);
		}

		if (current !== undefined) {
			this.state.elementToNode.set(current, this);
		}

		this._ref = current;
	}

	constructor(
		readonly parent: NavNode | undefined,
		private readonly hooks: NavHooks,
		private readonly name: string = '',
	) {
		this.state = parent?.state ?? new NavState();

		if (import.meta.env.DEV) {
			this.getPath = () => {
				let path = '';

				if (this.parent) {
					path += `${this.parent.getPath?.() ?? '…'} > `;
				}

				if (this.hooks.type) {
					path += `${this.hooks.type}`;
				}

				path += this.parent
					? `:nth-child(${this.parent.children.indexOf(this)})`
					: ':root';

				if (this.name) {
					path += `[name=${this.name}]`;
				}

				if (this.disposed_ && !this.parent?.disposed_) {
					path += ':disposed';
				}

				if (this.selected) {
					path += ':selected';
				}

				return path;
			};
		}
	}

	/** Used for debugging. Only available in development mode. */
	getPath?(): string;

	newChildToken() {
		assert(!this.disposed_, 'node is disposed');
		const maybeChildToken = this.hooks.onNewChild?.call(this);

		if (maybeChildToken) {
			return maybeChildToken;
		}

		const index = this.children.push(undefined) - 1;
		return new NavChildToken(this, index);
	}

	dispose(root = this) {
		if (this.disposed_) {
			return;
		}

		this.disposed_ = true;

		for (const [index, child] of this.children.entries()) {
			child?.dispose(root);
			this.children[index] = undefined;
		}

		if (this.selected) {
			this.state.deselect();
			root.parent?.getNextLeaf(root, 'next')?.select({
				focusVisible: isFocusVisible(),
			});
		}

		this.hooks.onDispose?.call(this);
		this.ref = undefined;
	}

	select(options?: NavSelectOptions) {
		assert(!this.disposed_, 'node is disposed');
		assert(this.hooks.onSelect !== undefined, 'select hook is undefined');

		if (this.selected) {
			return;
		}

		this.state.deselect();
		this.state.selected = this;
		this.hooks.onSelect.call(this, options);
	}

	deselect() {
		if (this.disposed_) {
			return;
		}

		assert(this.selected, 'node is not selected');
		this.hooks.onDeselect?.call(this);
	}

	getLeaf(via: NavDirection) {
		assert(!this.disposed_, 'node is disposed');
		return this.hooks.getLeaf?.call(this, via);
	}

	getNextLeaf(child: NavNode, via: NavDirection) {
		assert(!this.disposed_, 'node is disposed');
		assert(this.children.includes(child), 'node is not a child');
		return this.hooks.getNextLeaf?.call(this, child, via);
	}
}
