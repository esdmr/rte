import assert from '../assert.js';
import type {EventMap} from './types.js';
import {compositorNodeOfElement} from './registry.js';
import type {CompositorLayer} from './layer.js';

export function getCompositorNode(
	element: unknown,
): CompositorNode | undefined {
	if (!element) {
		return undefined;
	}

	const child = compositorNodeOfElement.get(element as HTMLElement);
	assert(child, `Element is not registered in a compositor`);
	return child;
}

export abstract class CompositorNode {
	constructor(
		/** @internal */
		readonly _element = document.createElement('section'),
	) {
		assert(
			!compositorNodeOfElement.has(this._element),
			'Element already registered in a compositor',
		);

		compositorNodeOfElement.set(this._element, this);

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
	): T | undefined {
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

	get style() {
		return this._element.style;
	}

	get classList() {
		return this._element.classList;
	}

	abstract get activeDescendant(): CompositorLayer | undefined;

	animate(
		keyframes?: Keyframe[] | PropertyIndexedKeyframes,
		options?: number | KeyframeAnimationOptions,
	): Animation {
		return this._element.animate(keyframes ?? null, options);
	}

	getAnimations(options?: GetAnimationsOptions): Animation[] {
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
		options?: boolean | AddEventListenerOptions,
	): void;
	addEventListener(
		type: string,
		listener: EventListenerOrEventListenerObject,
		options: boolean | AddEventListenerOptions,
	): void {
		this._element.addEventListener(type, listener, options);
	}

	dispatchEvent(event: EventMap[keyof EventMap]): boolean {
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
		options?: boolean | EventListenerOptions,
	): void;
	removeEventListener(
		type: string,
		listener: EventListenerOrEventListenerObject,
		options?: boolean | EventListenerOptions,
	): void {
		this._element.removeEventListener(type, listener, options);
	}
}
