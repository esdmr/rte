import {describe, expect, it} from 'vitest';
import {
	add,
	normalize,
	rotate,
	scale,
	subtract,
	transform,
	vector,
	vectorAngle,
	vectorLength,
	vectorPolar,
} from './geometry.js';

describe('vector', () => {
	it('returns a vector', () => {
		expect(vector(1, 2)).toMatchObject({
			x: 1,
			y: 2,
		});
	});

	it('throws if any component is infinite or NaN', () => {
		for (const value of [
			Number.NEGATIVE_INFINITY,
			Number.NaN,
			Number.POSITIVE_INFINITY,
		]) {
			expect(() => vector(value, 0)).toThrowErrorMatchingSnapshot(
				`x of ${value}`,
			);
			expect(() => vector(0, value)).toThrowErrorMatchingSnapshot(
				`y of ${value}`,
			);
			expect(() => vector(value, value)).toThrowErrorMatchingSnapshot(
				`both ${value}`,
			);
		}
	});
});

describe('vectorPolar', () => {
	it('returns the correct vectors', () => {
		const sqrt3 = Math.sqrt(3);

		for (const {angle, x, y} of [
			{angle: 0, x: 2, y: 0},
			{angle: Math.PI, x: -2, y: 0},
			{angle: Math.PI / 2, x: 0, y: 2},
			{angle: -Math.PI / 2, x: 0, y: -2},
			{angle: Math.PI / 4, x: Math.SQRT2, y: Math.SQRT2},
			{angle: -Math.PI / 4, x: Math.SQRT2, y: -Math.SQRT2},
			{angle: Math.PI * (3 / 4), x: -Math.SQRT2, y: Math.SQRT2},
			{angle: Math.PI * (-3 / 4), x: -Math.SQRT2, y: -Math.SQRT2},
			{angle: Math.PI / 6, x: sqrt3, y: 1},
			{angle: Math.PI * (5 / 6), x: -sqrt3, y: 1},
		]) {
			const vec = vectorPolar(2, angle);
			expect(vec.x).toBeCloseTo(x);
			expect(vec.y).toBeCloseTo(y);
		}
	});

	it('throws if any component is infinite or NaN', () => {
		for (const value of [
			Number.NEGATIVE_INFINITY,
			Number.NaN,
			Number.POSITIVE_INFINITY,
		]) {
			expect(() => vectorPolar(value, 0)).toThrowErrorMatchingSnapshot(
				`length of ${value}`,
			);
			expect(() => vectorPolar(1, value)).toThrowErrorMatchingSnapshot(
				`angle of ${value}`,
			);
			expect(() =>
				vectorPolar(value, value),
			).toThrowErrorMatchingSnapshot(`both ${value}`);
		}
	});
});

describe('vectorLength', () => {
	it('returns the length of vector', () => {
		expect(vectorLength(vector(2, 2))).toBeCloseTo(2 ** (3 / 2));
	});
});

describe('vectorAngle', () => {
	it('returns the angle of vector', () => {
		expect(vectorAngle(vector(2, 2))).toBeCloseTo(Math.PI / 4);
		expect(vectorAngle(vector(0, 0))).toBeCloseTo(0);
	});
});

describe('add', () => {
	it('adds all vectors', () => {
		expect(add()).toMatchObject({x: 0, y: 0});
		expect(add(vector(1, 1))).toMatchObject({x: 1, y: 1});
		expect(add(vector(1, 1), vector(2, 2))).toMatchObject({x: 3, y: 3});
		expect(add(vector(1, 1), vector(2, 2), vector(3, 3))).toMatchObject({
			x: 6,
			y: 6,
		});
	});
});

describe('subtract', () => {
	it('subtracts all vectors', () => {
		expect(subtract(vector(3, 2), vector(2, 3))).toMatchObject({
			x: 1,
			y: -1,
		});
	});
});

describe('scale', () => {
	it('multiplies the vector components', () => {
		expect(scale(3, vector(2, 3))).toMatchObject({x: 6, y: 9});
	});
});

describe('normalize', () => {
	it('returns a normalized vector', () => {
		const vec = normalize(vector(2, 2));
		expect(vec.x).toBeCloseTo(Math.SQRT1_2);
		expect(vec.y).toBeCloseTo(Math.SQRT1_2);
	});

	it('returns the zero vector unchanged', () => {
		expect(normalize(vector(0, 0))).toMatchObject({x: 0, y: 0});
	});
});

describe('transform', () => {
	it('applies a matrix to a vector', () => {
		expect(
			transform(
				{
					x: {x: 1, y: 2},
					y: {x: 3, y: 4},
				},
				vector(2, 2),
			),
		).toMatchObject({x: 6, y: 14});
	});
});

describe('rotate', () => {
	it('applies a rotation matrix to a vector', () => {
		const vec = rotate(Math.PI, vector(1, 2));
		expect(vec.x).toBeCloseTo(-1);
		expect(vec.y).toBeCloseTo(-2);
	});
});
