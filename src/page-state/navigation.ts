import {removeFocusVisible} from '../focus-visible.js';
import type {NavNode} from '../navigation/node.js';
import {StandardButtons} from './gamepad.js';
import type {PageStateHooks, PageStateNode} from './node.js';

const gamepadRepeatDelay = 500;
const gamepadRepeatInterval = 30;

type GamepadState = {
	readonly heldButton: 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight';
	timeoutId: ReturnType<typeof setTimeout> | undefined;
	intervalId: ReturnType<typeof setInterval> | undefined;
};

const gamepadState = new WeakMap<PageStateNode, GamepadState>();

const clearGamepadState = (node: PageStateNode) => {
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

export const navPageState = (root: NavNode): PageStateHooks => ({
	onKeyDown(event) {
		if (!/^Arrow(?:Up|Down|Left|Right)$/.test(event.code)) {
			return false;
		}

		event.preventDefault();
		clearGamepadState(this);
		handleKeyPress(root, event.code, false);
		return true;
	},
	onFocusIn(event) {
		if (!(event.target instanceof HTMLElement)) {
			return false;
		}

		if (event.target.dataset.skipFocusEvent !== undefined) {
			delete event.target.dataset.skipFocusEvent;
			return true;
		}

		const node = root.state.elementToNode.get(event.target);

		if (root.state.selected !== node) {
			removeFocusVisible();
			node?.select();
		}

		return true;
	},
	onGamepad([gamepad]) {
		const oldState = gamepadState.get(this);

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
				clearGamepadState(this);
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

				gamepadState.set(this, newState);
				handleKeyPress(root, heldButton, true);
				console.debug('Gamepad press', heldButton);
			}
		}

		return false;
	},
});
