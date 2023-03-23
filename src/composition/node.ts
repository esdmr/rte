import assert from '../assert.js';
import type {Disposable} from '../disposable.js';
import {compositorNodeOfElement} from './registry.js';
import type {CompositorLayer} from './layer.js';

export type EventMap = {
	Gamepad: GamepadEvent;
	ChildrenUpdate: Event;
} & HTMLElementEventMap;

export abstract class CompositorNode implements Disposable {
	constructor(
		/** @internal */
		readonly _element: HTMLElement = document.createElement('div'),
	) {
		assert(
			!compositorNodeOfElement.has(this._element),
			'Element already registered in a compositor',
		);

		compositorNodeOfElement.set(this._element, this);
		this.role = 'presentation';

		if (import.meta.env.DEV) {
			this._element.dataset.compositor = this.constructor.name;
		}
	}

	get parent(): CompositorNode | undefined {
		const {parentElement} = this._element;

		return parentElement
			? compositorNodeOfElement.get(parentElement)
			: undefined;
	}

	findNearest<T extends CompositorNode>(
		Class: abstract new (...args: any) => T,
	) {
		// eslint-disable-next-line @typescript-eslint/no-this-alias, unicorn/no-this-assignment
		let node: CompositorNode | undefined = this;

		while (node && !(node instanceof Class)) {
			node = node.parent;
		}

		return node;
	}

	get root(): CompositorNode {
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

	abstract get activeDescendant(): CompositorLayer | undefined;

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

	abstract dispose(): void;
}
