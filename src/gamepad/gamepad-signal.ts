import {signal, type Signal} from '@preact/signals';
import type {CompNode} from '../composition/node.js';
import type {GamepadClone} from './diff.js';

export const gamepads: Signal<readonly GamepadClone[]> = signal([]);

export const setupGamepadSignal = (root: CompNode) => {
	root.addEventListener('Gamepad', (event) => {
		gamepads.value = event.gamepads;
	});
};
