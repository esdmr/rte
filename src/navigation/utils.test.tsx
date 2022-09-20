import type {FunctionComponent} from 'preact';
import {createRef} from 'preact';
import {describe, expect, it, vi} from 'vitest';
import {NavNode} from './node.js';
import {
	getAnyLeaf,
	isVnodeFocusable,
	iterateChildren,
	setRef,
} from './utils.js';

describe('setRef', () => {
	it('calls the given function', () => {
		const setValue = vi.fn();
		setRef(setValue, 'a');
		expect(setValue).toBeCalledWith('a');
	});

	it('sets a ref object', () => {
		const ref = createRef<'a'>();
		const spiedRefCurrent = vi.spyOn(ref, 'current', 'set');

		setRef(ref, 'a');
		expect(spiedRefCurrent).toBeCalledWith('a');
	});

	it('ignores nullish refs', () => {
		setRef(null, 'a');
		setRef(undefined, 'a');
	});
});

describe('isVnodeFocusable', () => {
	it('recognizes focusable elements', () => {
		expect(isVnodeFocusable(<a href="" />)).toBe(true);
		expect(isVnodeFocusable(<area href="" />)).toBe(true);
		expect(isVnodeFocusable(<input />)).toBe(true);
		expect(isVnodeFocusable(<select />)).toBe(true);
		expect(isVnodeFocusable(<textarea />)).toBe(true);
		expect(isVnodeFocusable(<button />)).toBe(true);
		expect(isVnodeFocusable(<details />)).toBe(true);
		expect(isVnodeFocusable(<iframe />)).toBe(true);
		expect(isVnodeFocusable(<object />)).toBe(true);
		expect(isVnodeFocusable(<embed />)).toBe(true);
		expect(isVnodeFocusable(<audio controls />)).toBe(true);
		expect(isVnodeFocusable(<video controls />)).toBe(true);
		expect(isVnodeFocusable(<img useMap="#a" />)).toBe(true);
	});

	it('recognizes currently unfocusable elements', () => {
		expect(isVnodeFocusable(<a />)).toBe(false);
		expect(isVnodeFocusable(<area />)).toBe(false);
		expect(isVnodeFocusable(<input disabled />)).toBe(false);
		expect(isVnodeFocusable(<input type="hidden" />)).toBe(false);
		expect(isVnodeFocusable(<select disabled />)).toBe(false);
		expect(isVnodeFocusable(<textarea disabled />)).toBe(false);
		expect(isVnodeFocusable(<button disabled />)).toBe(false);
		expect(isVnodeFocusable(<audio />)).toBe(false);
		expect(isVnodeFocusable(<video />)).toBe(false);
		expect(isVnodeFocusable(<img />)).toBe(false);
	});

	it('recognizes tabindex', () => {
		expect(isVnodeFocusable(<div tabIndex={-1} />)).toBe(true);
	});

	it('recognizes contenteditable', () => {
		expect(isVnodeFocusable(<div contentEditable />)).toBe(true);
	});

	it('recognizes inert', () => {
		// @ts-expect-error inert is not yet in attributes interface of preact
		expect(isVnodeFocusable(<button inert />)).toBe(false);
	});

	it('throws if vnode is for a component', () => {
		const Component: FunctionComponent = () => null;

		expect(() => {
			isVnodeFocusable(<Component />);
		}).toThrowErrorMatchingInlineSnapshot(
			'"Assertion failed: cannot determine if component vnode is focusable"',
		);
	});
});

describe('getAnyLeaf', () => {
	const createLeaf = (parent: NavNode | undefined) =>
		new NavNode(parent, {
			getLeaf() {
				return this;
			},
		});

	it('returns the first found leaf', () => {
		const root = new NavNode(undefined, {});
		root.children[0] = undefined;
		root.children[1] = createLeaf(root);
		root.children[2] = createLeaf(root);

		const children = root.children.filter(Boolean) as NavNode[];
		expect(getAnyLeaf(children, 'next')).toBe(root.children[1]);
	});

	it('skips over children without a leaf', () => {
		const root = new NavNode(undefined, {});
		root.children[0] = undefined;
		root.children[1] = new NavNode(root, {});
		root.children[2] = createLeaf(root);
		root.children[3] = createLeaf(root);

		const children = root.children.filter(Boolean) as NavNode[];
		expect(getAnyLeaf(children, 'next')).toBe(root.children[2]);
	});

	it('returns undefined if no leaf found', () => {
		const root = new NavNode(undefined, {});
		root.children[0] = undefined;
		root.children[1] = new NavNode(root, {});

		const children = root.children.filter(Boolean) as NavNode[];
		expect(getAnyLeaf(children, 'next')).toBeUndefined();
	});

	it('passes the via parameter to children', () => {
		const spiedChildGetLeaf = vi.fn();
		const root = new NavNode(undefined, {});

		root.children[0] = new NavNode(root, {
			getLeaf: spiedChildGetLeaf,
		});

		const children = root.children.filter(Boolean) as NavNode[];
		getAnyLeaf(children, 'up');
		expect(spiedChildGetLeaf).toBeCalledWith('up');
	});

	it('short-circuits if a leaf is found', () => {
		const spiedChildGetLeaf = vi.fn();

		const root = new NavNode(undefined, {});
		root.children[0] = createLeaf(root);
		root.children[1] = new NavNode(root, {
			getLeaf: spiedChildGetLeaf,
		});

		const children = root.children.filter(Boolean) as NavNode[];
		getAnyLeaf(children, 'next');
		expect(spiedChildGetLeaf).toBeCalledTimes(0);
	});
});

describe('iterateChildren', () => {
	const createLeaf = (parent: NavNode | undefined) =>
		new NavNode(parent, {
			getLeaf() {
				return this;
			},
		});

	it('throws if parent node has no children', () => {
		const parent = new NavNode(undefined, {});

		expect(() => [
			...iterateChildren(parent, -1, 1),
		]).toThrowErrorMatchingInlineSnapshot(
			'"Assertion failed: empty node list"',
		);
	});

	it('skips over current node', () => {
		const parent = new NavNode(undefined, {});
		parent.children[0] = createLeaf(parent);
		parent.children[1] = createLeaf(parent);

		expect([...iterateChildren(parent, 0, 1)]).toMatchObject([
			parent.children[1],
		]);
	});

	it('does not yield if current node is last child', () => {
		const parent = new NavNode(undefined, {});
		parent.children[0] = createLeaf(parent);

		expect([...iterateChildren(parent, 0, 1)]).toMatchObject([]);
	});

	it('validates argument range', () => {
		const parent = new NavNode(undefined, {});
		parent.children[0] = createLeaf(parent);

		expect(() => [
			...iterateChildren(parent, -2, 1),
		]).toThrowErrorMatchingInlineSnapshot(
			'"Assertion failed: from out of range"',
		);

		expect(() => [
			...iterateChildren(parent, 1, 1),
		]).toThrowErrorMatchingInlineSnapshot(
			'"Assertion failed: from out of range"',
		);

		expect(() => [
			...iterateChildren(parent, -1, -1),
		]).toThrowErrorMatchingInlineSnapshot(
			'"Assertion failed: from out of range"',
		);

		expect(() => [
			...iterateChildren(parent, 2, -1),
		]).toThrowErrorMatchingInlineSnapshot(
			'"Assertion failed: from out of range"',
		);
	});

	it('iterates forward', () => {
		const parent = new NavNode(undefined, {});
		parent.children[0] = createLeaf(parent);
		parent.children[1] = createLeaf(parent);
		parent.children[2] = createLeaf(parent);

		expect([...iterateChildren(parent, 1, 1)]).toMatchObject([
			parent.children[2],
		]);

		expect([...iterateChildren(parent, 2, 1)]).toMatchObject([]);
	});

	it('iterates backward', () => {
		const parent = new NavNode(undefined, {});
		parent.children[0] = createLeaf(parent);
		parent.children[1] = createLeaf(parent);
		parent.children[2] = createLeaf(parent);

		expect([...iterateChildren(parent, 1, -1)]).toMatchObject([
			parent.children[0],
		]);

		expect([...iterateChildren(parent, 0, -1)]).toMatchObject([]);
	});

	it('skips over undefined', () => {
		const parent = new NavNode(undefined, {});
		parent.children[0] = createLeaf(parent);
		parent.children[1] = undefined;
		parent.children[2] = createLeaf(parent);

		expect([...iterateChildren(parent, 0, 1)]).toMatchObject([
			parent.children[2],
		]);
	});
});
