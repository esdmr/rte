import {scale, subtract, vectorPolar} from '../../../../geometry.js';
import {numberToString} from '../../../../number-to-string.js';
import * as svgPath from '../../../../svg-path.js';
import * as css from './index.module.css.js';
import type {FaceButtonStyle} from './types.js';

const symbolsRadius = 6;
const symbolsStrokeWidth = 0.2 * symbolsRadius;
const crossStrokeLength = Math.sqrt(
	(2 * symbolsRadius) ** 2 - symbolsStrokeWidth ** 2,
);
const trianglePointsDistance = symbolsRadius - symbolsStrokeWidth;
const diagonalUnit = /* @__PURE__ */ vectorPolar(1, -Math.PI / 4);
const antiDiagonalUnit = /* @__PURE__ */ vectorPolar(1, Math.PI / 4);

export const symbols: FaceButtonStyle = {
	name: 'symbols',
	down: {
		Icon() {
			const path = new svgPath.Context();
			svgPath.moveTo(path, scale(-crossStrokeLength / 2, antiDiagonalUnit), {
				absolute: true,
			});
			svgPath.lineTo(path, scale(crossStrokeLength, antiDiagonalUnit));
			svgPath.moveTo(path, scale(-crossStrokeLength / 2, diagonalUnit), {
				absolute: true,
			});
			svgPath.lineTo(path, scale(crossStrokeLength, diagonalUnit));

			return (
				<path
					d={path.toString()}
					stroke-width={symbolsStrokeWidth}
					class={css.maskInStroke}
				/>
			);
		},
		name: 'cross',
	},
	right: {
		Icon() {
			return (
				<circle
					x={0}
					y={0}
					r={symbolsRadius - symbolsStrokeWidth / 2}
					stroke-width={symbolsStrokeWidth}
					class={css.maskInStroke}
				/>
			);
		},
		name: 'circle',
	},
	left: {
		Icon() {
			const topLeft = vectorPolar(
				symbolsRadius - symbolsStrokeWidth * Math.SQRT1_2,
				(-3 * Math.PI) / 4,
			);
			const bottomRight = scale(-1, topLeft);
			const size = subtract(bottomRight, topLeft);

			return (
				<rect
					x={topLeft.x}
					y={topLeft.y}
					width={size.x}
					height={size.y}
					stroke-width={symbolsStrokeWidth}
					class={css.maskInStroke}
				/>
			);
		},
		name: 'square',
	},
	up: {
		Icon() {
			const points = [
				vectorPolar(trianglePointsDistance, -Math.PI / 2),
				vectorPolar(trianglePointsDistance, Math.PI / 6),
				vectorPolar(trianglePointsDistance, (5 * Math.PI) / 6),
			]
				.map((vec) => `${numberToString(vec.x)},${numberToString(vec.y)}`)
				.join(' ');

			return (
				<polygon
					points={points}
					stroke-width={symbolsStrokeWidth}
					class={css.maskInStroke}
				/>
			);
		},
		name: 'triangle',
	},
};
