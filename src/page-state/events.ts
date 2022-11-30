import {queueGamepadLoop} from '../gamepad/loop.js';
import {rootState} from './global.js';

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

export const onKeyDown = (event: KeyboardEvent) => {
	rootState.dispatchEvent('onKeyDown', event);
};

export const onFocusIn = (event: FocusEvent) => {
	rootState.dispatchEvent('onFocusIn', event);
};

export const onGamepadConnected = () => {
	queueGamepadLoop();
};
