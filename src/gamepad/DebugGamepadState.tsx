import type {FunctionComponent} from 'preact';
import {StandardAxes, StandardButtons} from './standard.js';
import {gamepads} from './GamepadToSignal.js';
import {DebugGamepadAxesCircularity} from './DebugGamepadAxesCircularity.js';
import * as css from './DebugGamepadState.module.css.js';

export const DebugGamepadState: FunctionComponent = () => (
	<>
		{gamepads.value.length === 0 && <p key="empty">Empty list.</p>}
		{gamepads.value.map((gamepad) => (
			<article key={gamepad.index}>
				<h2>
					Gamepad #{gamepad.index} (detected as{' '}
					<code>{gamepad.type ?? 'unknown'}</code>): {gamepad.id}
				</h2>

				<p>Buttons ({gamepad.buttons.length}):</p>
				<table aria-live="polite">
					{gamepad.buttons.map((button, index) => {
						const state =
							(button.pressed ? 'P' : '') +
							(button.touched ? 'T' : '');

						return (
							<tr key={index}>
								<td>{index}</td>
								<td>{StandardButtons[index]}</td>
								<td>{button.value}</td>
								<td>{state}</td>
							</tr>
						);
					})}
				</table>

				<p>Axes ({gamepad.axes.length}):</p>
				<table aria-live="polite">
					{gamepad.axes.map((axis, index) => (
						<tr key={index}>
							<td>{index}</td>
							<td>{StandardAxes[index]}</td>
							<td>{axis}</td>
						</tr>
					))}
				</table>

				<p>Axes circularity:</p>
				{gamepad.axes.length >= 2 && (
					<figure class={css.inlineFigure}>
						<DebugGamepadAxesCircularity
							xAxis={gamepad.axes[StandardAxes.leftX]!}
							yAxis={gamepad.axes[StandardAxes.leftY]!}
						/>
						<figcaption>Left axes</figcaption>
					</figure>
				)}
				{gamepad.axes.length >= 4 && (
					<figure class={css.inlineFigure}>
						<DebugGamepadAxesCircularity
							xAxis={gamepad.axes[StandardAxes.rightX]!}
							yAxis={gamepad.axes[StandardAxes.rightY]!}
						/>
						<figcaption>right axes</figcaption>
					</figure>
				)}
			</article>
		))}
	</>
);
