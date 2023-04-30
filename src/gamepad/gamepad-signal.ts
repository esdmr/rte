import {type Signal, signal} from '@preact/signals';
import {type CompLayer, useCompLayer} from '../composition/layer.js';
import assert from '../assert.js';
import type {GamepadClone} from './diff.js';

const gamepadsForLayers = new WeakMap<
	CompLayer,
	Signal<readonly GamepadClone[]>
>();

export const setupGamepadSignal = (layer: CompLayer) => {
	assert(
		!gamepadsForLayers.has(layer),
		'This compositor layer is already setup for gamepad signal',
	);

	const gamepads: Signal<readonly GamepadClone[]> = signal([]);
	gamepadsForLayers.set(layer, gamepads);

	layer.addEventListener('Gamepad', (event) => {
		gamepads.value = event.gamepads;
	});
};

export const useGamepads = () => {
	const layer = useCompLayer();
	const gamepads = gamepadsForLayers.get(layer);
	assert(gamepads, 'This compositor layer is not setup for gamepad signal');
	return gamepads;
};
