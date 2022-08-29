import type {Vector} from './geometry.js';
import {numberToString} from './number-to-string.js';

export class Context {
	private readonly segments: string[] = [];

	toString() {
		return this.segments.join('');
	}

	addSegment(absolute: boolean | undefined, command: string, ...args: Array<string | number | Vector>) {
		command = absolute ? command.toUpperCase() : command.toLowerCase();
		const arg = args.map(item => {
			if (typeof item === 'object') {
				return `${numberToString(item.x)},${numberToString(item.y)}`;
			}

			if (typeof item === 'number') {
				return numberToString(item);
			}

			return item;
		}).join(' ');

		this.segments.push(`${command}${arg}`);
	}
}

export function moveTo(context: Context, end: Vector, options?: {absolute?: boolean}) {
	context.addSegment(options?.absolute, 'm', end);
}

export function lineTo(context: Context, end: Vector, options?: {absolute?: boolean}) {
	context.addSegment(options?.absolute, 'l', end);
}

export function bezierCurveTo(context: Context, options: {
	control1: Vector;
	control2: Vector;
	end: Vector;
	absolute?: boolean;
}) {
	context.addSegment(options.absolute, 'c', options.control1, options.control2, options.end);
}

export function smoothBezierCurveTo(context: Context, control: Vector, end: Vector, options?: {absolute?: boolean}) {
	context.addSegment(options?.absolute, 's', control, end);
}

export function quadraticCurveTo(context: Context, control: Vector, end: Vector, options?: {absolute?: boolean}) {
	context.addSegment(options?.absolute, 'q', control, end);
}

export function smoothQuadraticCurveTo(context: Context, end: Vector, options?: {absolute?: boolean}) {
	context.addSegment(options?.absolute, 't', end);
}

export function ellipticalCurveTo(context: Context, options: {
	rx: number;
	ry: number;
	angle: number;
	largeArc: boolean;
	sweep: boolean;
	end: Vector;
	absolute?: boolean;
}) {
	context.addSegment(options.absolute, 'a', options.rx, options.ry, options.angle, options.largeArc ? 1 : 0, options.sweep ? 1 : 0, options.end);
}

export function closePath(context: Context) {
	context.addSegment(true, 'z');
}
