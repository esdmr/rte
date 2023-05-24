import type {FunctionComponent} from 'preact';
import type {GamepadAxisClone} from './diff.js';
import * as css from './DebugGamepadAxesCircularity.module.css';

const canvasSize = 128;
const canvasRadius = canvasSize / 2;
const axisPointerRadius = 2;

export const DebugGamepadAxesCircularity: FunctionComponent<{
	xAxis: GamepadAxisClone;
	yAxis: GamepadAxisClone;
}> = (props) => {
	return (
		<svg width={canvasSize} height={canvasSize}>
			<rect width={canvasSize} height={canvasSize} class={css.domain} />
			<circle
				cx={canvasRadius}
				cy={canvasRadius}
				r={canvasRadius}
				class={css.domain}
			/>
			<rect
				x={canvasRadius}
				width={1}
				height={canvasSize}
				class={css.domain}
			/>
			<rect
				y={canvasRadius}
				width={canvasSize}
				height={1}
				class={css.domain}
			/>
			<circle
				cx={(props.xAxis + 1) * canvasRadius}
				cy={(props.yAxis + 1) * canvasRadius}
				r={axisPointerRadius}
				class={css.pointer}
			/>
		</svg>
	);
};
