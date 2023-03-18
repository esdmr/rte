import type {RefObject} from 'preact';
import * as gfbi from '../icons/gamepad/face-button/index.js';
import {StandardButtons} from '../gamepad/standard.js';
import type {PageStateHooks, PageStateNode} from './node.js';

const gamepadButtonHeld = new WeakSet<PageStateNode>();
export type ButtonLike = HTMLAnchorElement | HTMLButtonElement;

export const buttonPageState = (
	ref: RefObject<ButtonLike>,
): PageStateHooks => ({
	onKeyDown(event) {
		return event.code === 'Enter';
	},
	onGamepad([gamepad]) {
		const oldState = gamepadButtonHeld.has(this);
		const newState = gamepad?.buttons[StandardButtons.a]!.pressed ?? false;

		if (newState && !oldState) {
			ref.current?.click();
		}

		if (newState) {
			gamepadButtonHeld.add(this);
		} else {
			gamepadButtonHeld.delete(this);
		}

		return false;
	},
	applyInputGuideEntries(entries) {
		entries.push({
			text: 'Select',
			icons: [
				// No keyboard icon yet.
				{
					Icon: () => (
						<gfbi.GamepadFaceButtonIcon
							style={gfbi.symbols}
							which="down"
						/>
					),
					mode: 'playstation-3',
				},
				{
					Icon: () => (
						<gfbi.GamepadFaceButtonIcon
							style={gfbi.symbols}
							which="down"
						/>
					),
					mode: 'playstation-4',
				},
				{
					Icon: () => (
						<gfbi.GamepadFaceButtonIcon
							style={gfbi.symbols}
							which="down"
						/>
					),
					mode: 'playstation-5',
				},
				{
					Icon: () => (
						<gfbi.GamepadFaceButtonIcon
							style={gfbi.lettersAb}
							which="down"
						/>
					),
					mode: 'xbox',
				},
				// I doubt that switch rotates the icons in horizontal grip.
				// Though, It does look rather funny.
				{
					Icon: () => (
						<gfbi.GamepadFaceButtonIcon
							style={gfbi.lettersBa}
							which="right"
							rotate="90deg"
						/>
					),
					mode: 'switch-r',
				},
				// No dpad icon for switch-l yet.
				{
					Icon: () => (
						<gfbi.GamepadFaceButtonIcon
							style={gfbi.lettersBa}
							which="down"
						/>
					),
					mode: 'switch-pro',
				},
			],
		});
	},
});
