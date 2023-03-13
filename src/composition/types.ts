import type {GamepadEvent} from '../gamepad/event.js';

export type EventMap = {
	Gamepad: GamepadEvent;
} & HTMLElementEventMap;
