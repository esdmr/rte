import type {Vector} from './geometry.js';
import {numberToString} from './number-to-string.js';

export class Context {
	private readonly segments: string[] = [];

	toString() {
		return this.segments.join('');
	}

	addSegment(
		absolute: boolean | undefined,
		command: string,
		...args: Array<string | number | Vector>
	) {
		command = absolute ? command.toUpperCase() : command.toLowerCase();
		const arg = args
			.map((item) => {
				if (typeof item === 'object') {
					return `${numberToString(item.x)},${numberToString(item.y)}`;
				}

				if (typeof item === 'number') {
					return numberToString(item);
				}

				return item;
			})
			.join(' ');

		this.segments.push(`${command}${arg}`);
	}
}

export const moveTo = (
	context: Context,
	end: Vector,
	options?: {absolute?: boolean},
) => {
	context.addSegment(options?.absolute, 'm', end);
};

export const lineTo = (
	context: Context,
	end: Vector,
	options?: {absolute?: boolean},
) => {
	context.addSegment(options?.absolute, 'l', end);
};

export const bezierCurveTo = (
	context: Context,
	options: {
		control1: Vector;
		control2: Vector;
		end: Vector;
		absolute?: boolean;
	},
) => {
	context.addSegment(
		options.absolute,
		'c',
		options.control1,
		options.control2,
		options.end,
	);
};

export const smoothBezierCurveTo = (
	context: Context,
	control: Vector,
	end: Vector,
	options?: {absolute?: boolean},
) => {
	context.addSegment(options?.absolute, 's', control, end);
};

export const quadraticCurveTo = (
	context: Context,
	control: Vector,
	end: Vector,
	options?: {absolute?: boolean},
) => {
	context.addSegment(options?.absolute, 'q', control, end);
};

export const smoothQuadraticCurveTo = (
	context: Context,
	end: Vector,
	options?: {absolute?: boolean},
) => {
	context.addSegment(options?.absolute, 't', end);
};

export const ellipticalCurveTo = (
	context: Context,
	options: {
		rx: number;
		ry: number;
		angle: number;
		largeArc: boolean;
		sweep: boolean;
		end: Vector;
		absolute?: boolean;
	},
) => {
	context.addSegment(
		options.absolute,
		'a',
		options.rx,
		options.ry,
		options.angle,
		options.largeArc ? 1 : 0,
		options.sweep ? 1 : 0,
		options.end,
	);
};

export const closePath = (context: Context) => {
	context.addSegment(true, 'z');
};
