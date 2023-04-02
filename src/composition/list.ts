import assert from '../assert.js';
import {CompNode} from './node.js';
import {compNodeOfElement} from './registry.js';

function getCompNodeOf(
	// eslint-disable-next-line @typescript-eslint/ban-types
	element: Element | null,
) {
	if (!element) {
		return undefined;
	}

	const child = compNodeOfElement.get(element);
	assert(child, 'Child of compositor list is not a compositor node');
	return child;
}

export class CompList<T extends CompNode = CompNode> extends CompNode {
	constructor(element?: HTMLElement) {
		assert(
			element !== document.body,
			'Refusing to initialize compositor list at document body',
		);

		super(element);
	}

	get children() {
		return [...this._element.children]
			.map((i) => getCompNodeOf(i) as T)
			.filter(Boolean) as readonly T[];
	}

	get firstChild() {
		return getCompNodeOf(this._element.firstElementChild) as T | undefined;
	}

	get lastChild() {
		return getCompNodeOf(this._element.lastElementChild) as T | undefined;
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

export function listParentOf<T extends CompNode>(node: T) {
	const {parent} = node;
	return parent instanceof CompList ? (parent as CompList<T>) : undefined;
}
