import type {CompLayer} from '../composition/layer.js';
import {removeFocusVisible} from '../focus-visible.js';
import {StandardButtons} from '../gamepad/standard.js';
import type {NavNode} from './node.js';

const gamepadRepeatDelay = 500;
const gamepadRepeatInterval = 30;

type GamepadState = {
	readonly heldButton: 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight';
	timeoutId: ReturnType<typeof setTimeout> | undefined;
	intervalId: ReturnType<typeof setInterval> | undefined;
};

const gamepadState = new WeakMap<CompLayer, GamepadState>();

const clearGamepadState = (node: CompLayer) => {
	const state = gamepadState.get(node);

	if (state) {
		if (state.timeoutId !== undefined) {
			clearTimeout(state.timeoutId);
		}

		if (state.intervalId !== undefined) {
			clearInterval(state.intervalId);
		}

		console.debug('Gamepad clear', state.heldButton);
	}

	gamepadState.delete(node);
};

const handleKeyPress = (root: NavNode, code: string, focusVisible: boolean) => {
	if (!root.state.selected) {
		root.getLeaf('next')?.select({focusVisible});
		return;
	}

	switch (code) {
		case 'ArrowUp': {
			root.state.up({focusVisible});
			break;
		}

		case 'ArrowDown': {
			root.state.down({focusVisible});
			break;
		}

		case 'ArrowLeft': {
			root.state.left({focusVisible});
			break;
		}

		case 'ArrowRight': {
			root.state.right({focusVisible});
			break;
		}

		// No default
	}
};

export function setupNavigation(
	root: NavNode,
	layer: CompLayer,
	signal?: AbortSignal,
) {
	layer.addEventListener(
		'LayerDispose',
		() => {
			console.group(
				'Composition layer is being disposed.',
				'Disposing its navigation root with it.',
			);
			root.dispose();
			console.log('Done!');
			console.groupEnd();
		},
		{signal},
	);

	layer.addEventListener(
		'keydown',
		(event) => {
			if (!/^Arrow(?:Up|Down|Left|Right)$/.test(event.code)) {
				return;
			}

			event.preventDefault();
			event.stopPropagation();
			clearGamepadState(layer);
			handleKeyPress(root, event.code, false);
		},
		{signal},
	);

	layer.addEventListener(
		'focusin',
		(event) => {
			if (!(event.target instanceof HTMLElement)) {
				return;
			}

			if (event.target.dataset.skipFocusEvent !== undefined) {
				delete event.target.dataset.skipFocusEvent;
				return;
			}

			const node = root.state.elementToNode.get(event.target);

			if (root.state.selected !== node) {
				removeFocusVisible();
				node?.select();
			}
		},
		{signal},
	);

	layer.addEventListener(
		'Gamepad',
		(event) => {
			const gamepad = event.gamepads[0];
			const oldState = gamepadState.get(layer);

			const heldButton =
				gamepad === undefined
					? undefined
					: gamepad.buttons[StandardButtons.up]!.pressed
					? 'ArrowUp'
					: gamepad.buttons[StandardButtons.down]!.pressed
					? 'ArrowDown'
					: gamepad.buttons[StandardButtons.left]!.pressed
					? 'ArrowLeft'
					: gamepad.buttons[StandardButtons.right]!.pressed
					? 'ArrowRight'
					: undefined;

			if (oldState?.heldButton !== heldButton) {
				if (oldState) {
					clearGamepadState(layer);
				}

				if (heldButton) {
					const newState: GamepadState = {
						heldButton,
						timeoutId: setTimeout(() => {
							newState.timeoutId = undefined;
							handleKeyPress(root, heldButton, true);
							console.debug('Gamepad repeat initial', heldButton);

							newState.intervalId = setInterval(() => {
								handleKeyPress(root, heldButton, true);
								console.debug('Gamepad repeat', heldButton);
							}, gamepadRepeatInterval);
						}, gamepadRepeatDelay),
						intervalId: undefined,
					};

					gamepadState.set(layer, newState);
					handleKeyPress(root, heldButton, true);
					console.debug('Gamepad press', heldButton);
				}
			}
		},
		{signal},
	);
}
