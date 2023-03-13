import type {GamepadClone} from './diff.js';

export class GamepadEvent extends Event {
	constructor(readonly gamepads: readonly GamepadClone[]) {
		super('Gamepad', {
			bubbles: true,
			composed: true,
		});
	}
}
