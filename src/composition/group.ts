import assert from '../assert.js';
import {CompositorNode} from './node.js';
import {compositorNodeOfElement} from './registry.js';

function getCompositorNodeOf(
	// eslint-disable-next-line @typescript-eslint/ban-types
	element: Element | null,
) {
	if (!element) {
		return undefined;
	}

	const child = compositorNodeOfElement.get(element);
	assert(child, 'Child of compositor group is not a compositor node');
	return child;
}

export class CompositorGroup<
	T extends CompositorNode = CompositorNode,
> extends CompositorNode {
	get children() {
		return [...this._element.children]
			.map((i) => getCompositorNodeOf(i) as T)
			.filter(Boolean) as readonly T[];
	}

	get firstChild() {
		return getCompositorNodeOf(this._element.firstElementChild) as
			| T
			| undefined;
	}

	get lastChild() {
		return getCompositorNodeOf(this._element.lastElementChild) as
			| T
			| undefined;
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
		this._onChildrenUpdate();
	}

	after(ref: T, ...newChildren: T[]) {
		assert(ref.parent === this, 'Reference is not a child of this node');
		ref._element.after(...newChildren.map((i) => i._element));
		this._onChildrenUpdate();
	}

	append(...nodes: T[]): void {
		this._element.append(...nodes.map((i) => i._element));
		this._onChildrenUpdate();
	}

	prepend(...nodes: T[]): void {
		this._element.append(...nodes.map((i) => i._element));
		this._onChildrenUpdate();
	}

	replace(oldChild: T, ...newChildren: T[]) {
		assert(
			oldChild.parent === this,
			'Node to be replaced is not a child of this node',
		);

		oldChild._element.replaceWith(...newChildren.map((i) => i._element));
		this._onChildrenUpdate();
	}

	remove(oldChild: T) {
		assert(
			oldChild.parent === this,
			'Node to be removed is not a child of this node',
		);

		oldChild._element.remove();
		this._onChildrenUpdate();
	}

	dispose() {
		for (const child of this.children) {
			child.dispose();
		}
	}

	private _onChildrenUpdate() {
		this.dispatchEvent(new Event('ChildrenUpdate'));
	}
}

export function groupParentOf<T extends CompositorNode>(node: T) {
	const {parent} = node;
	return parent instanceof CompositorGroup
		? (parent as CompositorGroup<T>)
		: undefined;
}
