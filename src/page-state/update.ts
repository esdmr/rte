import {
	onFocusIn,
	onGamepadConnected,
	onKeyDown,
	toggleEvent,
} from './events.js';
import {rootState} from './global.js';

const originalTitle = document.title;
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

		const titles = [...rootState.listTitles(), originalTitle];
		document.title = titles.filter(Boolean).join(' - ');

		// FIXME: Remove.
		console.debug('Page state updated.');
	});
};
