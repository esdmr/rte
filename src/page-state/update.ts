import {inputGuideEntries, type InputGuideEntry} from '../InputGuide.js';
import {
	onFocusIn,
	onGamepadConnected,
	onKeyDown,
	toggleEvent,
} from './events.js';
import {rootState} from './global.js';

let updateQueued = false;

export const queueUpdate = () => {
	if (updateQueued) {
		return;
	}

	updateQueued = true;

	queueMicrotask(() => {
		updateQueued = false;

		toggleEvent(
			document.body,
			rootState.hasEvent('onKeyDown'),
			'keydown',
			onKeyDown,
		);

		toggleEvent(
			document.body,
			rootState.hasEvent('onFocusIn'),
			'focusin',
			onFocusIn,
		);

		toggleEvent(
			window,
			rootState.hasEvent('onGamepad'),
			'gamepadconnected',
			onGamepadConnected,
		);

		const newEntries: InputGuideEntry[] = [];
		rootState.applyInputGuideEntries(newEntries);
		inputGuideEntries.value = newEntries;

		console.debug('Page state updated.');
	});
};
