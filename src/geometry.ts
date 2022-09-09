import assert from './assert.js';

export type Vector = {
	readonly x: number;
	readonly y: number;
};

export type Transform = {
	readonly x: {readonly x: number; readonly y: number};
	readonly y: {readonly x: number; readonly y: number};
};

export function vector(x: number, y: number): Vector {
	assert(
		Number.isFinite(x) && Number.isFinite(y),
		'vector components must be finite',
	);

	return {x, y};
}

export function vectorPolar(length: number, angle: number): Vector {
	return vector(length * Math.cos(angle), length * Math.sin(angle));
}

export function vectorLength(vec: Vector) {
	return Math.hypot(vec.y, vec.x);
}

export function vectorAngle(vec: Vector) {
	return Math.atan2(vec.y, vec.x);
}

export function add(...args: Vector[]): Vector {
	let x = 0;
	let y = 0;

	for (const item of args) {
		x += item.x;
		y += item.y;
	}

	return {x, y};
}

export function subtract(minuend: Vector, subtrahend: Vector) {
	return vector(minuend.x - subtrahend.x, minuend.y - subtrahend.y);
}

export function scale(coefficient: number, vec: Vector) {
	return vector(coefficient * vec.x, coefficient * vec.y);
}

export function normalize(vec: Vector) {
	const length = vectorLength(vec);

	// Zero vector cannot be normalized.
	if (length === 0) {
		return vector(0, 0);
	}

	return scale(1 / length, vec);
}

export function transform(matrix: Transform, vec: Vector) {
	return vector(
		matrix.x.x * vec.x + matrix.x.y * vec.y,
		matrix.y.x * vec.x + matrix.y.y * vec.y,
	);
}

export function rotate(angle: number, vec: Vector) {
	return transform(
		{
			x: {x: Math.cos(angle), y: -Math.sin(angle)},
			y: {x: Math.sin(angle), y: Math.cos(angle)},
		},
		vec,
	);
}
