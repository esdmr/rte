import type {RefObject} from 'preact';
import {StandardButtons} from './gamepad.js';
import type {PageStateHooks, PageStateNode} from './node.js';

const gamepadButtonHeld = new WeakSet<PageStateNode>();
export type ButtonLike = HTMLAnchorElement | HTMLButtonElement;

export const buttonPageState = (
	ref: RefObject<ButtonLike>,
): PageStateHooks => ({
	onKeyDown(event) {
		return event.code === 'Enter';
	},
	onGamepad([gamepad]) {
		const oldState = gamepadButtonHeld.has(this);
		const newState = gamepad?.buttons[StandardButtons.a]!.pressed ?? false;

		if (newState && !oldState) {
			ref.current?.click();
		}

		if (newState) {
			gamepadButtonHeld.add(this);
		} else {
			gamepadButtonHeld.delete(this);
		}

		return false;
	},
});
