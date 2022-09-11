import assert from '../../assert.js';
import {NavChildToken} from './child-token.js';
import {NavState} from './state.js';

export type NavDirection = 'next' | 'up' | 'down' | 'left' | 'right';

export type NavHooks = {
	dispose?(this: NavNode): void;
	select?(this: NavNode): void;
	deselect?(this: NavNode): void;
	getLeaf?(this: NavNode, via: NavDirection): NavNode | undefined;
	getNextLeaf?(
		this: NavNode,
		child: NavNode,
		dir: NavDirection,
	): NavNode | undefined;
};

export class NavNode {
	static for(childToken: NavChildToken, hooks: NavHooks) {
		const node = new NavNode(childToken.parent, hooks);
		childToken.child = node;
		return node;
	}

	readonly state: NavState;
	readonly children: Array<NavNode | undefined> = [];
	private isDisposed = false;

	get isSelected() {
		assert(!this.isDisposed, 'node is disposed');
		return this.state.selected === this;
	}

	get ref() {
		return this.state.nodeToElement.get(this);
	}

	set ref(current: HTMLElement | undefined) {
		const old = this.ref;

		if (old !== undefined) {
			this.state.nodeToElement.delete(this);
			this.state.elementToNode.delete(old);
		}

		if (current !== undefined) {
			this.state.nodeToElement.set(this, current);
			this.state.elementToNode.set(current, this);
		}
	}

	constructor(
		readonly parent: NavNode | undefined,
		private readonly hooks: NavHooks,
	) {
		this.parent = parent;
		this.state = parent?.state ?? new NavState();
	}

	newChildToken() {
		assert(!this.isDisposed, 'node is disposed');
		const index = this.children.push(undefined) - 1;
		return new NavChildToken(this, index);
	}

	dispose(root = this) {
		if (this.isDisposed) {
			return;
		}

		for (const [index, child] of this.children.entries()) {
			child?.dispose(root);
			this.children[index] = undefined;
		}

		if (this.isSelected) {
			this.state.deselect();
			root.parent?.getNextLeaf(root, 'next')?.select();
		}

		this.isDisposed = true;
		this.hooks.dispose?.call(this);
		this.ref = undefined;
	}

	select() {
		assert(!this.isDisposed, 'node is disposed');
		assert(this.hooks.select !== undefined, 'select hook is undefined');

		if (this.isSelected) {
			return;
		}

		this.state.deselect();
		this.state.selected = this;
		this.hooks.select.call(this);
	}

	deselect() {
		assert(!this.isDisposed, 'node is disposed');
		assert(this.isSelected, 'node is not selected');
		assert(this.hooks.deselect !== undefined, 'deselect hook is undefined');
		this.hooks.deselect.call(this);
	}

	getLeaf(via: NavDirection) {
		assert(!this.isDisposed, 'node is disposed');
		return this.hooks.getLeaf?.call(this, via);
	}

	getNextLeaf(child: NavNode, via: NavDirection) {
		assert(!this.isDisposed, 'node is disposed');
		assert(this.children.includes(child), 'node is not a child');
		return this.hooks.getNextLeaf?.call(this, child, via);
	}
}
