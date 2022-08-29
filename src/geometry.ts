export interface Vector {
	x: number;
	y: number;
}

export interface Transform {
	x: {x: number; y: number};
	y: {x: number; y: number};
}

export function vector(x: number, y: number): Vector {
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
	return vector(
		minuend.x - subtrahend.x,
		minuend.y - subtrahend.y,
	);
}

export function scale(coefficient: number, vec: Vector) {
	return vector(
		coefficient * vec.x,
		coefficient * vec.y,
	);
}

export function normalize(vec: Vector) {
	return scale(1 / vectorLength(vec), vec);
}

export function transform(matrix: Transform, vec: Vector) {
	return vector(
		(matrix.x.x * vec.x) + (matrix.x.y * vec.y),
		(matrix.y.x * vec.x) + (matrix.y.y * vec.y),
	);
}

export function rotate(angle: number, vec: Vector) {
	return transform({
		x: {x: Math.cos(angle), y: -Math.sin(angle)},
		y: {x: Math.sin(angle), y: Math.cos(angle)},
	}, vec);
}
