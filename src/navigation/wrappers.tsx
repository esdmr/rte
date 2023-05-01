import type {FunctionComponent, JSX} from 'preact';
import {useRef} from 'preact/hooks';
import type {GamepadEvent, InputGuideUpdateEvent} from '../gamepad/event.js';
import {StandardButtons} from '../gamepad/standard.js';
import * as gfbi from '../icons/gamepad/face-button/index.js';
import {NavItem} from './NavItem.js';
import {isVnodeFocusable} from './utils.js';

export type ButtonLike = HTMLAnchorElement | HTMLButtonElement;
const gamepadButtonHeld = new WeakSet<ButtonLike>();
const buttonLikeId = Symbol('button-like input guide');

function buttonLikeKeyDown(event: KeyboardEvent) {
	if (event.code === 'Enter') {
		event.stopPropagation();
	}
}

function buttonLikeGamepad<T extends ButtonLike>(
	event: preact.JSX.TargetedEvent<T, GamepadEvent>,
) {
	const {currentTarget, gamepads} = event;
	const oldState = gamepadButtonHeld.has(currentTarget);
	const newState = gamepads[0]?.buttons[StandardButtons.a]!.pressed ?? false;

	if (newState && !oldState) {
		currentTarget.click();
	}

	if (newState) {
		gamepadButtonHeld.add(currentTarget);
	} else {
		gamepadButtonHeld.delete(currentTarget);
	}
}

function buttonLikeInputGuide(event: InputGuideUpdateEvent) {
	event.entries.push({
		text: 'Select',
		id: buttonLikeId,
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
}

function createButtonLike<T extends 'a' | 'button'>(name: T) {
	const Name = name as unknown as FunctionComponent<JSX.HTMLAttributes<any>>;

	const WrappedComponent: FunctionComponent<JSX.IntrinsicElements[T]> = (
		props,
	) => {
		const ref = useRef<ButtonLike>(null);
		const vnode = (
			<Name
				{...props}
				onKeyDown={buttonLikeKeyDown}
				onGamepad={buttonLikeGamepad}
				onInputGuideUpdate={buttonLikeInputGuide}
				children={props.children}
				ref={ref}
			/>
		);
		const isFocusable = isVnodeFocusable(vnode);

		return isFocusable ? <NavItem>{vnode}</NavItem> : vnode;
	};

	if (import.meta.env.DEV) {
		WrappedComponent.displayName = `WrappedButtonLike(${name})`;
	}

	return WrappedComponent;
}

function createGeneric<T extends keyof JSX.IntrinsicElements>(name: T) {
	const Name: string = name;

	const WrappedComponent: FunctionComponent<JSX.IntrinsicElements[T]> = (
		props,
	) => {
		const vnode = <Name {...props} />;
		return isVnodeFocusable(vnode) ? <NavItem>{vnode}</NavItem> : vnode;
	};

	if (import.meta.env.DEV) {
		WrappedComponent.displayName = `WrappedGeneric(${name})`;
	}

	return WrappedComponent;
}

export const A = /* @__PURE__ */ createButtonLike('a');
export const Button = /* @__PURE__ */ createButtonLike('button');
export const Input = /* @__PURE__ */ createGeneric('input');
export const Select = /* @__PURE__ */ createGeneric('select');
export const Textarea = /* @__PURE__ */ createGeneric('textarea');
