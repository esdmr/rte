import {queueGamepadLoop} from '../gamepad/loop.js';
import {rootState} from './global.js';

/** @deprecated */
export const toggleEvent = (
	target: EventTarget,
	enabled: boolean,
	name: string,
	handler: (event: any) => void,
) => {
	target.removeEventListener(name, handler);

	if (enabled) {
		target.addEventListener(name, handler);
	}
};

/** @deprecated */
export const onKeyDown = (event: KeyboardEvent) => {
	rootState.dispatchEvent('onKeyDown', event);
};

/** @deprecated */
export const onFocusIn = (event: FocusEvent) => {
	rootState.dispatchEvent('onFocusIn', event);
};

/** @deprecated */
export const onGamepadConnected = () => {
	queueGamepadLoop();
};
