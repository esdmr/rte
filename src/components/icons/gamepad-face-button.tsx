import type {FunctionComponent} from 'preact';
import {scale, subtract, vector, vectorPolar} from '../../geometry.js';
import {numberToString} from '../../number-to-string.js';
import * as svgPath from '../../svg-path.js';
import * as css from './gamepad-face-button.module.css.js';

const symbolsRadius = 6;
const symbolsStrokeWidth = 0.2 * symbolsRadius;
const crossStrokeLength = Math.sqrt((symbolsRadius ** 2) - ((symbolsStrokeWidth / 2) ** 2)) - (symbolsStrokeWidth / 2);
const trianglePointsDistance = symbolsRadius - symbolsStrokeWidth;
const diagonalUnit = /* @__PURE__ */vectorPolar(1, -Math.PI / 4);
const antiDiagonalUnit = /* @__PURE__ */vectorPolar(1, Math.PI / 4);

export type Direction = 'down' | 'right' | 'left' | 'up';

const symbols: Record<Direction, {Symbol: FunctionComponent; name: string}> = {
	down: {
		Symbol() {
			const path = new svgPath.Context();
			svgPath.moveTo(path, vector(symbolsStrokeWidth * Math.SQRT1_2, 0), {absolute: true});
			svgPath.lineTo(path, scale(crossStrokeLength, antiDiagonalUnit));
			svgPath.lineTo(path, scale(-symbolsStrokeWidth, diagonalUnit));
			svgPath.lineTo(path, scale(-crossStrokeLength, antiDiagonalUnit));
			svgPath.lineTo(path, scale(-crossStrokeLength, diagonalUnit));
			svgPath.lineTo(path, scale(-symbolsStrokeWidth, antiDiagonalUnit));
			svgPath.lineTo(path, scale(crossStrokeLength, diagonalUnit));
			svgPath.lineTo(path, scale(-crossStrokeLength, antiDiagonalUnit));
			svgPath.lineTo(path, scale(symbolsStrokeWidth, diagonalUnit));
			svgPath.lineTo(path, scale(crossStrokeLength, antiDiagonalUnit));
			svgPath.lineTo(path, scale(crossStrokeLength, diagonalUnit));
			svgPath.lineTo(path, scale(symbolsStrokeWidth, antiDiagonalUnit));
			svgPath.closePath(path);

			return <path d={path.toString()} class={css.maskInFill} />;
		},
		name: 'cross',
	},
	right: {
		Symbol() {
			return <circle x={0} y={0} r={symbolsRadius - (symbolsStrokeWidth / 2)} stroke-width={symbolsStrokeWidth} class={css.maskInStroke} />;
		},
		name: 'circle',
	},
	left: {
		Symbol() {
			const topLeft = vectorPolar(symbolsRadius - (symbolsStrokeWidth * Math.SQRT1_2), -3 * Math.PI / 4);
			const bottomRight = scale(-1, topLeft);
			const size = subtract(bottomRight, topLeft);

			return <rect x={topLeft.x} y={topLeft.y} width={size.x} height={size.y} stroke-width={symbolsStrokeWidth} class={css.maskInStroke} />;
		},
		name: 'square',
	},
	up: {
		Symbol() {
			const points = [
				vectorPolar(trianglePointsDistance, -Math.PI / 2),
				vectorPolar(trianglePointsDistance, Math.PI / 6),
				vectorPolar(trianglePointsDistance, 5 * Math.PI / 6),
			].map(vec => `${numberToString(vec.x)},${numberToString(vec.y)}`).join(' ');

			return <polygon points={points} stroke-width={symbolsStrokeWidth} class={css.maskInStroke} />;
		},
		name: 'triangle',
	},
};

const lettersAb: Record<Direction, string> = {
	down: 'A',
	right: 'B',
	left: 'X',
	up: 'Y',
};

const lettersBa: Record<Direction, string> = {
	down: 'B',
	right: 'A',
	left: 'Y',
	up: 'X',
};

const numbersBolt: Record<Direction, string> = {
	down: '1',
	right: '2',
	left: '3',
	up: '4',
};

const numbersCircle: Record<Direction, string> = {
	up: '1',
	right: '2',
	down: '3',
	left: '4',
};

export const GamepadFaceButtonIcon: FunctionComponent<{
	/**
	 * - `symbols`: Use symbols like the DualShock:
	 * - `letters-ab`: Use letters like the Xbox controllers:
	 * - `letters-ba`: Use letters like the Nintendo controllers.
	 * - `numbers-bolt`: Use numbers starting from the bottom.
	 * - `numbers-circle`: Use numbers starting from the top.
	 *
	 * |      style       | down  | right | left  |  up   |
	 * | :--------------: | :---: | :---: | :---: | :---: |
	 * |    `symbols`     |   ✖   |   ●   |   ■   |   ▲   |
	 * |   `letters-ab`   |   A   |   B   |   X   |   Y   |
	 * |   `letters-ba`   |   B   |   A   |   Y   |   X   |
	 * |  `numbers-bolt`  |   1   |   2   |   3   |   4   |
	 * | `numbers-circle` |   3   |   2   |   4   |   1   |
	 */
	style: 'symbols' | 'letters-ab' | 'letters-ba' | 'numbers-bolt' | 'numbers-circle';
	which: Direction;
	class?: string;
}> = props => {
	const id = `gabi-mask-${props.style}-${props.which}`;
	const symbol = symbols[props.which];

	return <svg class={`${css.gamepadFaceButtonIcon} ${props.class ?? ''}`.trim()} viewBox='-8 -8 16 16' data-style={props.style} data-which={props.which}>
		<title>
			{'Gamepad '}
			{props.style === 'symbols' && symbol.name}
			{props.style === 'letters-ab' && lettersAb[props.which]}
			{props.style === 'letters-ba' && lettersBa[props.which]}
			{props.style === 'numbers-circle' && numbersCircle[props.which]}
			{props.style === 'numbers-bolt' && numbersBolt[props.which]}
			{' button'}
		</title>
		<circle cx={0} cy={0} r={8} class={css.base} mask={`url(#${id})`} />
		<defs aria-hidden>
			<mask id={id}>
				<rect x={-8} y={-8} width={16} height={16} class={css.maskOut} />
				{props.style === 'symbols' && <symbol.Symbol />}
				{props.style === 'letters-ab' && <text x={0} y={0} class={css.maskInFill}>{lettersAb[props.which]}</text>}
				{props.style === 'letters-ba' && <text x={0} y={0} class={css.maskInFill}>{lettersBa[props.which]}</text>}
				{props.style === 'numbers-circle' && <text x={0} y={0} class={css.maskInFill}>{numbersCircle[props.which]}</text>}
				{props.style === 'numbers-bolt' && <text x={0} y={0} class={css.maskInFill}>{numbersBolt[props.which]}</text>}
			</mask>
		</defs>
	</svg>;
};
