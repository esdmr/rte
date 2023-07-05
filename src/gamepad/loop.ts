import {activeInputMode} from './input-mode.js';
import {cloneGamepads, compareGamepads, type GamepadClone} from './diff.js';
import {GamepadEvent} from './event.js';

let gamepadLoopId: number | undefined;
let oldGamepads: GamepadClone[] = [];

const gamepadLoop = () => {
	gamepadLoopId = undefined;

	performance.mark('gamepad.filter.start');

	const newGamepads = navigator
		.getGamepads()
		.filter((gamepad): gamepad is Gamepad => gamepad !== null)
		.filter(({connected, mapping}) => connected && mapping === 'standard');

	performance.mark('gamepad.filter.end');
	performance.measure(
		'gamepad.filter',
		'gamepad.filter.start',
		'gamepad.filter.end',
	);

	if (newGamepads.length > 0 && document.visibilityState === 'visible') {
		queueGamepadLoop();
	}

	performance.mark('gamepad.unmapped_diff.start');

	const shouldUpdate =
		oldGamepads.length !== newGamepads.length ||
		oldGamepads.some((oldGamepad, index) =>
			compareGamepads(oldGamepad, newGamepads[index]!),
		);

	performance.mark('gamepad.unmapped_diff.end');
	performance.measure(
		'gamepad.unmapped_diff',
		'gamepad.unmapped_diff.start',
		'gamepad.unmapped_diff.end',
	);

	if (shouldUpdate) {
		performance.mark('gamepad.update.start');

		oldGamepads = cloneGamepads(newGamepads);
		activeInputMode.value = oldGamepads[0]
			? oldGamepads[0].type ?? 'xbox'
			: 'keyboard';
		(document.activeElement ?? document.body).dispatchEvent(
			new GamepadEvent(oldGamepads),
		);

		performance.mark('gamepad.update.end');
		performance.measure(
			'gamepad.update',
			'gamepad.update.start',
			'gamepad.update.end',
		);
	}
};

export const queueGamepadLoop = () => {
	if (gamepadLoopId !== undefined) {
		return;
	}

	gamepadLoopId = requestAnimationFrame(gamepadLoop);
};

export const setupGamepad = () => {
	document.addEventListener(
		'visibilitychange',
		() => {
			console.debug('Visibility changed:', document.visibilityState);

			if (document.visibilityState === 'visible') {
				queueGamepadLoop();
			}
		},
		{
			passive: true,
		},
	);

	addEventListener('gamepadconnected', () => {
		queueGamepadLoop();
	});

	queueGamepadLoop();
};
