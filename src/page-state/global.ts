import {createContext} from 'preact';
import {PageStateNode} from './node.js';

const originalTitle = document.title;
export const rootState = new PageStateNode(undefined, {});
export const pageStateContext = createContext(rootState);

if (import.meta.env.DEV) {
	pageStateContext.displayName = 'pageState';
}

const enabledEvents = new Map<string, boolean>();

const toggleEvent = <T extends keyof HTMLElementEventMap>(
	name: T,
	enabled: boolean,
	handler: (event: HTMLElementEventMap[T]) => void,
) => {
	if (enabled === enabledEvents.get(name)) {
		return;
	}

	if (enabled) {
		document.body.addEventListener(name, handler);
	} else {
		document.body.removeEventListener(name, handler);
	}

	enabledEvents.set(name, enabled);
};

const onKeyDown = (event: KeyboardEvent) => {
	return rootState.dispatchEvent('onKeyDown', event);
};

const onFocusIn = (event: FocusEvent) => {
	return rootState.dispatchEvent('onFocusIn', event);
};

let updateQueued = false;

export const queueUpdate = () => {
	if (updateQueued) {
		return;
	}

	updateQueued = true;

	queueMicrotask(() => {
		updateQueued = false;

		toggleEvent('keydown', rootState.hasEvent('onKeyDown'), onKeyDown);
		toggleEvent('focusin', rootState.hasEvent('onFocusIn'), onFocusIn);

		const titles = [...rootState.listTitles(), originalTitle];
		document.title = titles.filter(Boolean).join(' - ');

		// FIXME: Remove.
		console.debug('Page state updated.');
	});
};
