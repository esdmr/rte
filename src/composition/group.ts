import assert from '../assert.js';
import {CompositorNode, getCompositorNode} from './node.js';

export class CompositorGroup<
	T extends CompositorNode = CompositorNode,
> extends CompositorNode {
	get children() {
		return [...this._element.children].map((i) => {
			const child = getCompositorNode(i);
			assert(child, 'Child of CompositorGroup is not a CompositorNode');
			return child as T;
		}) as readonly T[];
	}

	get firstChild() {
		return getCompositorNode(this._element.firstElementChild) as T | undefined;
	}

	get lastChild() {
		return getCompositorNode(this._element.lastElementChild) as T | undefined;
	}

	get hasChildren() {
		return this._element.childElementCount > 0;
	}

	get childrenCount() {
		return this._element.childElementCount;
	}

	override get activeDescendant() {
		return this.lastChild?.activeDescendant;
	}

	before(ref: T, ...newChildren: T[]) {
		assert(ref.parent === this, 'Reference is not a child of this node');
		ref._element.before(...newChildren.map((i) => i._element));
		this._onChildrenUpdated?.();
	}

	after(ref: T, ...newChildren: T[]) {
		assert(ref.parent === this, 'Reference is not a child of this node');
		ref._element.after(...newChildren.map((i) => i._element));
		this._onChildrenUpdated?.();
	}

	append(...nodes: T[]): void {
		this._element.append(...nodes.map((i) => i._element));
		this._onChildrenUpdated?.();
	}

	prepend(...nodes: T[]): void {
		this._element.append(...nodes.map((i) => i._element));
		this._onChildrenUpdated?.();
	}

	replace(oldChild: T, ...newChildren: T[]) {
		assert(
			oldChild.parent === this,
			'Node to be replaced is not a child of this node',
		);

		oldChild._element.replaceWith(...newChildren.map((i) => i._element));
		this._onChildrenUpdated?.();
	}

	remove(oldChild: T) {
		assert(
			oldChild.parent === this,
			'Node to be removed is not a child of this node',
		);

		oldChild._element.remove();
		this._onChildrenUpdated?.();
	}

	protected _onChildrenUpdated?(): void;
}

export function groupParentOf<T extends CompositorNode>(
	node: T,
): CompositorGroup<T> | undefined {
	const {parent} = node;
	return parent instanceof CompositorGroup ? parent : undefined;
}
