import assert from '../assert.js';
import type {Disposable} from '../disposable.js';
import {isFocusVisible} from '../focus-visible.js';
import {NavChildToken} from './child-token.js';
import {NavState} from './state.js';

export type NavDirection = 'next' | 'up' | 'down' | 'left' | 'right';

export type NavSelectOptions = {
	focusVisible?: boolean;
};

export type NavHooks = {
	type?: string;
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
	private disposed = false;

	get selected() {
		assert(!this.disposed, 'node is disposed');
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
	) {
		this.state = parent?.state ?? new NavState();
	}

	getPath(): string {
		let path = this.parent
			? `${this.parent.getPath()}[${this.parent.children.indexOf(this)}]`
			: 'root';

		if (this.hooks.type) {
			path += `(${this.hooks.type})`;
		}

		if (this.disposed && !this.parent?.disposed) {
			path += '.dispose()';
		}

		if (this.selected) {
			path += '.select()';
		}

		return path;
	}

	newChildToken() {
		assert(!this.disposed, 'node is disposed');
		const maybeChildToken = this.hooks.onNewChild?.call(this);

		if (maybeChildToken) {
			return maybeChildToken;
		}

		const index = this.children.push(undefined) - 1;
		return new NavChildToken(this, index);
	}

	dispose(root = this) {
		if (this.disposed) {
			return;
		}

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

		this.disposed = true;
		this.hooks.onDispose?.call(this);
		this.ref = undefined;
	}

	select(options?: NavSelectOptions) {
		assert(!this.disposed, 'node is disposed');
		assert(this.hooks.onSelect !== undefined, 'select hook is undefined');

		if (this.selected) {
			return;
		}

		this.state.deselect();
		this.state.selected = this;
		this.hooks.onSelect.call(this, options);
	}

	deselect() {
		assert(!this.disposed, 'node is disposed');
		assert(this.selected, 'node is not selected');
		this.hooks.onDeselect?.call(this);
	}

	getLeaf(via: NavDirection) {
		assert(!this.disposed, 'node is disposed');
		return this.hooks.getLeaf?.call(this, via);
	}

	getNextLeaf(child: NavNode, via: NavDirection) {
		assert(!this.disposed, 'node is disposed');
		assert(this.children.includes(child), 'node is not a child');
		return this.hooks.getNextLeaf?.call(this, child, via);
	}
}
