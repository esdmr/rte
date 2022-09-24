import type {FunctionComponent} from 'preact';
import {standardAxesMap, standardButtonsMap} from './gamepad.js';
import {gamepads} from './GamepadToSignal.js';

export const DebugGamepad: FunctionComponent = () => (
	<>
		{gamepads.value.length === 0 && <div key="empty">Empty list.</div>}
		{gamepads.value.map((gamepad) => (
			<div key={gamepad.index}>
				<h3>
					Gamepad #{gamepad.index}: {gamepad.id}
				</h3>

				<p>Buttons ({gamepad.buttons.length}):</p>
				<table aria-live="polite">
					{gamepad.buttons.map((button, index) => {
						const state =
							(button.pressed ? 'P' : '') + (button.touched ? 'T' : '');

						return (
							<tr key={index}>
								<td>{index}</td>
								<td>{standardButtonsMap[index]}</td>
								<td>{button.value}</td>
								<td>{state}</td>
							</tr>
						);
					})}
				</table>

				<p>Axes ({gamepad.axes.length}):</p>
				<table>
					{gamepad.axes.map((axis, index) => (
						<tr key={index}>
							<td>{index}</td>
							<td>{standardAxesMap[index]}</td>
							<td>{axis}</td>
						</tr>
					))}
				</table>
			</div>
		))}
	</>
);
