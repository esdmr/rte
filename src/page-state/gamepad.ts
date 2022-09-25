import {rootState} from './global.js';

export type GamepadButtonClone = {
	value: number;
	pressed: boolean;
	touched: boolean;
};

export type GamepadClone = {
	index: number;
	id: string;
	buttons: GamepadButtonClone[];
	axes: number[];
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

export const cloneGamepads = (gamepads: Gamepad[]) =>
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

	const newGamepads = navigator
		.getGamepads()
		.filter((gamepad): gamepad is Gamepad => gamepad !== null)
		.filter(({connected, mapping}) => connected && mapping === 'standard');

	if (newGamepads.length > 0 && document.visibilityState === 'visible') {
		queueGamepadLoop();
	}

	const shouldUpdate =
		oldGamepads.length !== newGamepads.length ||
		oldGamepads.some((oldGamepad, index) =>
			compareGamepads(oldGamepad, newGamepads[index]!),
		);

	if (shouldUpdate) {
		oldGamepads = cloneGamepads(newGamepads);
		rootState.dispatchEvent('onGamepad', oldGamepads);
	}
};

export const queueGamepadLoop = () => {
	if (gamepadLoopId !== undefined) {
		return;
	}

	gamepadLoopId = requestAnimationFrame(gamepadLoop);
};

document.addEventListener('visibilitychange', () => {
	if (import.meta.env.DEV) {
		console.debug('Visibility changed:', document.visibilityState);
	}

	if (document.visibilityState === 'visible') {
		queueGamepadLoop();
	}
});

export const standardButtons = {
	a: 0,
	b: 1,
	x: 2,
	y: 3,
	l1: 4,
	r1: 5,
	l2: 6,
	r2: 7,
	select: 8,
	start: 9,
	l3: 10,
	r3: 11,
	up: 12,
	down: 13,
	left: 14,
	right: 15,
	_unused: 16,
} as const;

export const standardButtonsMap = Object.fromEntries(
	Object.entries(standardButtons).map(([k, v]) => [v, k]),
);

export const standardAxes = {
	leftX: 0,
	leftY: 1,
	rightX: 2,
	rightY: 3,
} as const;

export const standardAxesMap = Object.fromEntries(
	Object.entries(standardAxes).map(([k, v]) => [v, k]),
);
