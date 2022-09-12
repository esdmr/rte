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

export const isVnodeFocusable = (vnode: VNode<Record<string, unknown>>) => {
	const hasHref = typeof vnode.props.href === 'string';
	const hasTabIndex =
		Boolean(vnode.props.tabIndex) || Boolean(vnode.props.tabindex);
	const isContentEditable =
		Boolean(vnode.props.contentEditable) ||
		Boolean(vnode.props.contenteditable);
	const isNotDisabled = !vnode.props.disabled;

	return (
		(vnode.type === 'a' && hasHref) ||
		(vnode.type === 'area' && hasHref) ||
		(vnode.type === 'input' && isNotDisabled) ||
		(vnode.type === 'select' && isNotDisabled) ||
		(vnode.type === 'textarea' && isNotDisabled) ||
		(vnode.type === 'button' && isNotDisabled) ||
		vnode.type === 'iframe' ||
		vnode.type === 'object' ||
		vnode.type === 'embed' ||
		hasTabIndex ||
		isContentEditable
	);
};

export const getAnyLeaf = (nodes: Iterable<NavNode>, via: NavDirection) => {
	for (const node of nodes) {
		const leaf = node.getLeaf(via);

		if (leaf !== undefined) {
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
