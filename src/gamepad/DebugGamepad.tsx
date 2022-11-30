import type {FunctionComponent} from 'preact';
import {StandardAxes, StandardButtons} from './standard.js';
import {gamepads} from './GamepadToSignal.js';

export const DebugGamepad: FunctionComponent = () => (
	<>
		{gamepads.value.length === 0 && <p key="empty">Empty list.</p>}
		{gamepads.value.map((gamepad) => (
			<article key={gamepad.index}>
				<h3>
					Gamepad #{gamepad.index} (detected as{' '}
					<code>{gamepad.type ?? 'unknown'}</code>): {gamepad.id}
				</h3>

				<p>Buttons ({gamepad.buttons.length}):</p>
				<table aria-live="polite">
					{gamepad.buttons.map((button, index) => {
						const state =
							(button.pressed ? 'P' : '') + (button.touched ? 'T' : '');

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
			</article>
		))}
	</>
);
