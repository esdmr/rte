import type {Ref, VNode} from 'preact';
import assert from '../../assert.js';
import type {NavNode, NavDirection} from './node.js';

// eslint-disable-next-line @typescript-eslint/ban-types
export function setRef<T>(ref: Ref<T> | null | undefined, value: T | null) {
	if (typeof ref === 'function') {
		ref(value);
	} else if (ref) {
		ref.current = value;
	}
}

export function isVnodeFocusable(vnode: VNode<Record<string, unknown>>) {
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
}

export function* iterateToStart(
	nodes: Array<NavNode | undefined>,
	from: number,
) {
	const length = nodes.length;
	assert(length > 0, 'empty node list');

	for (let index = from; index >= 0; index--) {
		yield nodes[index];
	}
}

export function* iterateToEnd(nodes: Array<NavNode | undefined>, from: number) {
	const length = nodes.length;
	assert(length > 0, 'empty node list');

	for (let index = from; index < length; index++) {
		yield nodes[index];
	}
}

export function getAnyLeaf(
	nodes: Iterable<NavNode | undefined>,
	via: NavDirection,
) {
	for (const node of nodes) {
		const leaf = node?.getLeaf(via);

		if (leaf !== undefined) {
			return leaf;
		}
	}

	return undefined;
}
