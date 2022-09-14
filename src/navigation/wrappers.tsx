import type {FunctionComponent, JSX} from 'preact';
import {NavItem} from './NavItem.js';
import {isVnodeFocusable} from './utils.js';

function createWrapper<T extends keyof JSX.IntrinsicElements>(name: T) {
	const Name: string = name;

	const WrappedComponent: FunctionComponent<JSX.IntrinsicElements[T]> = (
		props,
	) => {
		const vnode = <Name {...props} />;
		return isVnodeFocusable(vnode) ? <NavItem>{vnode}</NavItem> : vnode;
	};

	if (import.meta.env.DEV) {
		WrappedComponent.displayName = `WrappedDomNode(${name})`;
	}

	return WrappedComponent;
}

export const A = /* @__PURE__ */ createWrapper('a');
export const Area = /* @__PURE__ */ createWrapper('area');
export const Input = /* @__PURE__ */ createWrapper('input');
export const Select = /* @__PURE__ */ createWrapper('select');
export const Textarea = /* @__PURE__ */ createWrapper('textarea');
export const Button = /* @__PURE__ */ createWrapper('button');
export const Iframe = /* @__PURE__ */ createWrapper('iframe');
export const Object = /* @__PURE__ */ createWrapper('object');
export const Embed = /* @__PURE__ */ createWrapper('embed');
