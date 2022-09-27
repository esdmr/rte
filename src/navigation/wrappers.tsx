import type {FunctionComponent, JSX} from 'preact';
import {useMemo, useRef} from 'preact/hooks';
import {buttonPageState, type ButtonLike} from '../page-state/button.js';
import {NavItem} from './NavItem.js';
import {isVnodeFocusable} from './utils.js';

function createButtonLike<T extends 'a' | 'button'>(name: T) {
	const Name = name as unknown as FunctionComponent<JSX.HTMLAttributes<any>>;

	const WrappedComponent: FunctionComponent<JSX.IntrinsicElements[T]> = (
		props,
	) => {
		const ref = useRef<ButtonLike>(null);
		const vnode = <Name {...props} children={props.children} ref={ref} />;
		const isFocusable = isVnodeFocusable(vnode);
		const isInteractive = Boolean(props.href) || Boolean(props.onSelect);
		const pageStateHooks = useMemo(() => buttonPageState(ref), []);

		return isFocusable ? (
			<NavItem
				onSelectPageStateHooks={isInteractive ? pageStateHooks : undefined}
			>
				{vnode}
			</NavItem>
		) : (
			vnode
		);
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
