import assert from '../assert.js';
import {CompNode, tryRemovingFromParent} from './node.js';
import {compNodeOfElement} from './registry.js';

const datasetKey = 'key';

export abstract class CompRecord<
	T extends Record<string, CompNode>,
> extends CompNode {
	constructor(element?: HTMLElement, initialValues?: Readonly<Partial<T>>) {
		super(element);

		if (initialValues) {
			for (const [key, value] of Object.entries(initialValues)) {
				this.set(key, value as T[string]);
			}
		}
	}

	*entries() {
		const children = [...this._element.children];

		for (const child of children) {
			const key = (child as HTMLElement).dataset?.[datasetKey];
			const node = compNodeOfElement.get(child) as T[string];

			if (this.isAtDocumentBody && (!node || key === undefined)) {
				console.warn(
					'`document.body` contains garbage. Probably due to some browser extensions.',
				);
				continue;
			}

			assert(node, 'Non-compositor child found in compositor record');

			assert(
				typeof key === 'string',
				'Child without a key found in compositor record',
			);

			yield [key, node] as const;
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
		return this.entries();
	}

	get children() {
		return Object.fromEntries(this) as Readonly<Partial<T>>;
	}

	get<K extends keyof T & string>(key: K) {
		for (const [actualKey, child] of this) {
			if (key === actualKey) {
				return child as T[K];
			}
		}

		return undefined;
	}

	set<K extends keyof T & string>(key: K, newNode: T[K]) {
		const oldNode = this.get(key);

		if (oldNode) {
			oldNode._element.replaceWith(newNode._element);
			// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
			delete oldNode._element.dataset[datasetKey];
		} else {
			this._element.append(newNode._element);
		}

		newNode._element.dataset[datasetKey] = key;
	}

	delete(key: keyof T & string) {
		const oldNode = this.get(key);

		if (oldNode) {
			oldNode._element.remove();
			// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
			delete oldNode._element.dataset[datasetKey];
		}
	}

	override remove(oldChild: T[string]) {
		assert(
			oldChild.parent === this,
			'Node to be removed is not a child of this node',
		);

		oldChild._element.remove();
		this._onChildrenUpdate();
	}

	dispose() {
		for (const child of this.values()) {
			child.dispose();
		}

		tryRemovingFromParent(this);
	}

	private _onChildrenUpdate() {
		this.dispatchEvent(new Event('ChildrenUpdate'));
	}
}
