import {detectGamepadType, type GamepadType} from './db.js';

export type GamepadButtonClone = {
	readonly value: number;
	readonly pressed: boolean;
	readonly touched: boolean;
};

export type GamepadClone = {
	readonly index: number;
	readonly id: string;
	readonly type: GamepadType | undefined;
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
		type: detectGamepadType(gamepad.id),
		buttons: gamepad.buttons.map<GamepadButtonClone>((button) => ({
			value: button.value,
			pressed: button.pressed,
			touched: button.touched,
		})),
		axes: gamepad.axes.map(Number),
	}));
