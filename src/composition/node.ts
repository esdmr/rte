import assert from '../assert.js';
import type {Disposable} from '../disposable.js';
import {compNodeOfElement} from './registry.js';
import type {CompLayer} from './layer.js';
import type {EventMap} from './event.js';

assert(typeof document.body.inert === 'boolean', 'Inert polyfill is required');

export abstract class CompNode implements Disposable {
	constructor(
		/** @internal */
		readonly _element: HTMLElement = document.createElement('div'),
	) {
		assert(
			!compNodeOfElement.has(this._element),
			'Element already registered in a compositor',
		);

		compNodeOfElement.set(this._element, this);
		this.role = 'presentation';

		if (import.meta.env.DEV) {
			this._element.dataset.className = this.constructor.name;
		}
	}

	get isAtDocumentBody() {
		return this._element === document.body;
	}

	get parent(): CompNode | undefined {
		const {parentElement} = this._element;

		return parentElement ? compNodeOfElement.get(parentElement) : undefined;
	}

	findNearest<T extends CompNode>(Class: abstract new (...args: any) => T) {
		// eslint-disable-next-line @typescript-eslint/no-this-alias, unicorn/no-this-assignment
		let node: CompNode | undefined = this;

		while (node && !(node instanceof Class)) {
			node = node.parent;
		}

		return node;
	}

	get root(): CompNode {
		return this.parent?.root ?? this;
	}

	get classList() {
		return this._element.classList;
	}

	get inert() {
		return this._element.inert;
	}

	set inert(value) {
		this._element.inert = value;
	}

	get hidden() {
		return this._element.hidden;
	}

	set hidden(value) {
		this._element.hidden = value;
	}

	get role() {
		return this._element.getAttribute('role') ?? undefined;
	}

	set role(value) {
		if (value === undefined) {
			this._element.removeAttribute('role');
		} else {
			this._element.setAttribute('role', value);
		}
	}

	abstract get activeDescendant(): CompLayer | undefined;

	animate(
		keyframes?: Keyframe[] | PropertyIndexedKeyframes,
		options?: number | KeyframeAnimationOptions,
	) {
		return this._element.animate(keyframes ?? null, options);
	}

	getAnimations(options?: GetAnimationsOptions) {
		return this._element.getAnimations(options);
	}

	addEventListener<K extends keyof EventMap>(
		type: K,
		listener: (this: HTMLElement, ev: EventMap[K]) => any,
		options?: boolean | AddEventListenerOptions,
	): void;
	addEventListener(
		type: string,
		listener: EventListenerOrEventListenerObject,
		options: boolean | AddEventListenerOptions,
	) {
		this._element.addEventListener(type, listener, options);
	}

	dispatchEvent(event: EventMap[keyof EventMap]) {
		return this._element.dispatchEvent(event);
	}

	removeEventListener<K extends keyof EventMap>(
		type: K,
		listener: (this: HTMLElement, ev: EventMap[K]) => any,
		options?: boolean | EventListenerOptions,
	): void;
	removeEventListener(
		type: string,
		listener: EventListenerOrEventListenerObject,
		options: boolean | EventListenerOptions,
	) {
		this._element.removeEventListener(type, listener, options);
	}

	remove?(oldChild: CompNode): void;
	abstract dispose(): void;
}

export function tryRemovingFromParent(node: CompNode) {
	const {parent} = node;

	if (parent && !parent.remove) {
		return false;
	}

	parent?.remove!(node);
	return true;
}
