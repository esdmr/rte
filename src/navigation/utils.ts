import type {Ref, VNode} from 'preact';
import assert from '../assert.js';
import type {NavNode, NavDirection} from './node.js';

// eslint-disable-next-line @typescript-eslint/ban-types
export const setRef = <T>(ref: Ref<T> | null | undefined, value: T | null) => {
	if (typeof ref === 'function') {
		ref(value);
	} else if (ref) {
		ref.current = value;
	}
};

const focusableVnodes: Record<
	string,
	(vnode: VNode<Record<string, unknown>>) => boolean
> = {
	a(vnode) {
		return typeof vnode.props.href === 'string';
	},
	area(vnode) {
		return typeof vnode.props.href === 'string';
	},
	input(vnode) {
		return !vnode.props.disabled && vnode.props.type !== 'hidden';
	},
	select(vnode) {
		return !vnode.props.disabled;
	},
	textarea(vnode) {
		return !vnode.props.disabled;
	},
	button(vnode) {
		return !vnode.props.disabled;
	},
	details() {
		return true;
	},
	iframe() {
		return true;
	},
	object() {
		return true;
	},
	embed() {
		return true;
	},
	audio(vnode) {
		return Boolean(vnode.props.controls);
	},
	video(vnode) {
		return Boolean(vnode.props.controls);
	},
	img(vnode) {
		return Boolean(vnode.props.usemap || vnode.props.useMap);
	},
};

export const isVnodeFocusable = (vnode: VNode<Record<string, unknown>>) => {
	assert(
		typeof vnode.type === 'string',
		'cannot determine if component vnode is focusable',
	);

	const hasTabIndex =
		typeof vnode.props.tabIndex === 'number' ||
		typeof vnode.props.tabindex === 'number';

	const isContentEditable = Boolean(
		vnode.props.contentEditable || vnode.props.contenteditable,
	);

	return (
		!vnode.props.inert &&
		(hasTabIndex ||
			isContentEditable ||
			Boolean(focusableVnodes[vnode.type]?.(vnode)))
	);
};

export const getAnyLeaf = (nodes: Iterable<NavNode>, via: NavDirection) => {
	for (const node of nodes) {
		const leaf = node.getLeaf(via);

		if (leaf !== undefined && !leaf.disposed) {
			return leaf;
		}
	}

	return undefined;
};

export function* iterateChildren(node: NavNode, from: number, dir: 1 | -1) {
	const {children} = node;
	const {length} = children;
	assert(length > 0, 'empty node list');
	from += dir;
	const to = dir > 0 ? length : -1;

	if (from === to) {
		return;
	}

	assert(from >= 0 && from < length, 'from out of range');

	for (let index = from; index !== to; index += dir) {
		const node = children[index];

		if (node !== undefined) {
			yield node;
		}
	}
}
