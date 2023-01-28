import type {FunctionComponent} from 'preact';
import {useRef, useEffect} from 'preact/hooks';
import type {GamepadAxisClone} from './diff.js';

const canvasSize = 128;
const canvasRadius = canvasSize / 2;
const axisPointerRadius = 2;
const tau = 2 * Math.PI;

const background = document.createElement('canvas');

{
	const ctx = background.getContext('2d')!;

	ctx.fillStyle = 'white';
	ctx.strokeStyle = 'gray';
	ctx.lineWidth = 1;

	// Background:
	ctx.fillRect(0, 0, canvasSize, canvasSize);
	// Domain square:
	ctx.strokeRect(0, 0, canvasSize, canvasSize);
	ctx.beginPath();
	// Domain circle:
	ctx.arc(canvasRadius, canvasRadius, canvasRadius, 0, tau, false);
	// Vertical center:
	ctx.moveTo(canvasRadius, 0);
	ctx.lineTo(canvasRadius, canvasSize);
	// Horizontal center:
	ctx.moveTo(0, canvasRadius);
	ctx.lineTo(canvasSize, canvasRadius);
	ctx.stroke();
}

export const DebugGamepadAxesCircularity: FunctionComponent<{
	xAxis: GamepadAxisClone;
	yAxis: GamepadAxisClone;
}> = (props) => {
	const ref = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const ctx = ref.current?.getContext('2d');

		if (!ctx) {
			return;
		}

		const x = (props.xAxis + 1) * canvasRadius;
		const y = (props.yAxis + 1) * canvasRadius;

		ctx.drawImage(background, 0, 0);
		ctx.beginPath();
		ctx.arc(x, y, axisPointerRadius, 0, tau, false);
		ctx.fill();
	}, [props.xAxis, props.yAxis]);

	return <canvas width={canvasSize} height={canvasSize} ref={ref} />;
};
