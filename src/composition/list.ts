import assert from '../assert.js';
import {CompNode, tryRemovingFromParent} from './node.js';
import {getCompNodeOf} from './registry.js';

const description = 'compositor list';

export class CompList<T extends CompNode = CompNode> extends CompNode {
	constructor(element?: HTMLElement) {
		assert(
			element !== document.body,
			'Refusing to initialize compositor list at document body',
		);

		super(element);
	}

	*entries() {
		const children = [...this._element.children];

		for (const [i, child] of children.entries()) {
			const node = getCompNodeOf(child, description) as T;
			assert(node, 'Non-compositor child found in compositor list');
			yield [i, node] as const;
		}
	}

	*keys() {
		for (const [key] of this.entries()) {
			yield key;
		}
	}

	*values() {
		for (const [, node] of this.entries()) {
			yield node;
		}
	}

	[Symbol.iterator]() {
		return this.values();
	}

	get children() {
		return [...this] as const;
	}

	get firstChild() {
		return getCompNodeOf(this._element.firstElementChild, description) as
			| T
			| undefined;
	}

	get lastChild() {
		return getCompNodeOf(this._element.lastElementChild, description) as
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

	override remove(oldChild: T) {
		assert(
			oldChild.parent === this,
			'Node to be removed is not a child of this node',
		);

		oldChild._element.remove();
		this._onChildrenUpdate();
	}

	dispose() {
		for (const child of this) {
			child.dispose();
		}

		tryRemovingFromParent(this);
	}

	private _onChildrenUpdate() {
		this.dispatchEvent(new Event('ChildrenUpdate'));
	}
}
