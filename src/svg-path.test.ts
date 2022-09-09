import {describe, expect, it} from 'vitest';
import {vector} from './geometry.js';
import * as svgPath from './svg-path.js';

describe('Context', () => {
	it('processes absolute commands', () => {
		const context = new svgPath.Context();
		context.addSegment(true, 'a', 'aA');
		context.addSegment(true, 'A', 'aA');
		expect(context.toString()).toBe('AaAAaA');
	});

	it('processes relative commands', () => {
		const context = new svgPath.Context();
		context.addSegment(false, 'a', 'aA');
		context.addSegment(false, 'A', 'aA');
		context.addSegment(undefined, 'a', 'aA');
		context.addSegment(undefined, 'A', 'aA');
		expect(context.toString()).toBe('aaAaaAaaAaaA');
	});

	it('processes strings, numbers, and vectors', () => {
		const context = new svgPath.Context();
		context.addSegment(false, 'a', 'a', 2, vector(1, 2));
		expect(context.toString()).toBe('aa 2 1,2');
	});

	it('calls numberToString', () => {
		const context = new svgPath.Context();
		context.addSegment(false, 'a', 1e-21, vector(1e-21, 1e-21));
		expect(context.toString()).toBe('a0 0,0');
	});
});

describe('moveTo', () => {
	it('adds a segment', () => {
		const context = new svgPath.Context();
		svgPath.moveTo(context, vector(1, 2));
		svgPath.moveTo(context, vector(3, 4), {absolute: true});
		expect(context.toString()).toMatchInlineSnapshot('"m1,2M3,4"');
	});
});

describe('lineTo', () => {
	it('adds a segment', () => {
		const context = new svgPath.Context();
		svgPath.lineTo(context, vector(1, 2));
		svgPath.lineTo(context, vector(3, 4), {absolute: true});
		expect(context.toString()).toMatchInlineSnapshot('"l1,2L3,4"');
	});
});

describe('bezierCurveTo', () => {
	it('adds a segment', () => {
		const context = new svgPath.Context();

		svgPath.bezierCurveTo(context, {
			control1: vector(1, 2),
			control2: vector(3, 4),
			end: vector(5, 6),
		});

		svgPath.bezierCurveTo(context, {
			control1: vector(7, 8),
			control2: vector(9, 10),
			end: vector(11, 12),
			absolute: true,
		});

		expect(context.toString()).toMatchInlineSnapshot(
			'"c1,2 3,4 5,6C7,8 9,10 11,12"',
		);
	});
});

describe('smoothBezierCurveTo', () => {
	it('adds a segment', () => {
		const context = new svgPath.Context();

		svgPath.smoothBezierCurveTo(context, vector(1, 2), vector(3, 4));
		svgPath.smoothBezierCurveTo(context, vector(5, 6), vector(7, 8), {
			absolute: true,
		});

		expect(context.toString()).toMatchInlineSnapshot('"s1,2 3,4S5,6 7,8"');
	});
});

describe('quadraticCurveTo', () => {
	it('adds a segment', () => {
		const context = new svgPath.Context();

		svgPath.quadraticCurveTo(context, vector(1, 2), vector(3, 4));
		svgPath.quadraticCurveTo(context, vector(5, 6), vector(7, 8), {
			absolute: true,
		});

		expect(context.toString()).toMatchInlineSnapshot('"q1,2 3,4Q5,6 7,8"');
	});
});

describe('smoothQuadraticCurveTo', () => {
	it('adds a segment', () => {
		const context = new svgPath.Context();
		svgPath.smoothQuadraticCurveTo(context, vector(1, 2));
		svgPath.smoothQuadraticCurveTo(context, vector(3, 4), {absolute: true});
		expect(context.toString()).toMatchInlineSnapshot('"t1,2T3,4"');
	});
});

describe('ellipticalCurveTo', () => {
	it('adds a segment', () => {
		const context = new svgPath.Context();

		svgPath.ellipticalCurveTo(context, {
			rx: 1,
			ry: 2,
			angle: 3,
			largeArc: false,
			sweep: true,
			end: vector(4, 5),
		});

		svgPath.ellipticalCurveTo(context, {
			rx: 6,
			ry: 7,
			angle: 8,
			largeArc: true,
			sweep: false,
			end: vector(9, 10),
			absolute: true,
		});

		expect(context.toString()).toMatchInlineSnapshot(
			'"a1 2 3 0 1 4,5A6 7 8 1 0 9,10"',
		);
	});
});

describe('closePath', () => {
	it('adds a segment', () => {
		const context = new svgPath.Context();
		svgPath.closePath(context);
		expect(context.toString()).toMatchInlineSnapshot('"Z"');
	});
});
