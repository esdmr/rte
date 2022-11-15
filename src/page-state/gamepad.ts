import {rootState} from './global.js';
import {activeInputMode} from './input-mode.js';

export type GamepadButtonClone = {
	readonly value: number;
	readonly pressed: boolean;
	readonly touched: boolean;
};

export type GamepadClone = {
	readonly index: number;
	readonly id: string;
	readonly buttons: readonly GamepadButtonClone[];
	readonly axes: readonly number[];
};

const buttonsComparisonPrecision = 2;
const axesComparisonPrecision = 15;

export const compareGamepads = (from: GamepadClone, to: Gamepad) =>
	from.index !== to.index ||
	from.id !== to.id ||
	from.buttons.length !== to.buttons.length ||
	from.axes.length !== to.axes.length ||
	from.buttons.some(
		(button, index) =>
			button.value.toFixed(buttonsComparisonPrecision) !==
			to.buttons[index]!.value.toFixed(buttonsComparisonPrecision),
	) ||
	from.axes.some(
		(axis, index) =>
			axis.toFixed(axesComparisonPrecision) !==
			to.axes[index]!.toFixed(axesComparisonPrecision),
	);

export const cloneGamepads = (gamepads: readonly Gamepad[]) =>
	gamepads.map<GamepadClone>((gamepad) => ({
		index: gamepad.index,
		id: gamepad.id,
		buttons: gamepad.buttons.map<GamepadButtonClone>((button) => ({
			value: button.value,
			pressed: button.pressed,
			touched: button.touched,
		})),
		axes: gamepad.axes.map(Number),
	}));

let gamepadLoopId: number | undefined;
let oldGamepads: GamepadClone[] = [];

const gamepadLoop = () => {
	gamepadLoopId = undefined;

	performance.mark('gamepad.filter.start');

	const newGamepads = navigator
		.getGamepads()
		.filter((gamepad): gamepad is Gamepad => gamepad !== null)
		// TODO: Implement non-standard gamepad mapping.
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

		// TODO: Implement gamepad type detection.
		activeInputMode.value = 'playstation-3';
		oldGamepads = cloneGamepads(newGamepads);
		rootState.dispatchEvent('onGamepad', oldGamepads);

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

export enum StandardButtons {
	a = 0,
	b = 1,
	x = 2,
	y = 3,
	l1 = 4,
	r1 = 5,
	l2 = 6,
	r2 = 7,
	select = 8,
	start = 9,
	l3 = 10,
	r3 = 11,
	up = 12,
	down = 13,
	left = 14,
	right = 15,
	_unused = 16,
}

export enum StandardAxes {
	leftX = 0,
	leftY = 1,
	rightX = 2,
	rightY = 3,
}
