import {describe, expect, it, vi} from 'vitest';
import type {NavDirection, NavSelectOptions} from './node.js';
import {NavNode} from './node.js';
import {NavState} from './state.js';

describe('NavState', () => {
	describe('deselect', () => {
		it('deselects the selected node', () => {
			const node = new NavNode(undefined, {});
			const spiedNodeDeselect = vi.spyOn(node, 'deselect');

			expect(node.state).toBeInstanceOf(NavState);
			node.state.selected = node;
			node.state.deselect();
			expect(spiedNodeDeselect).toBeCalled();
			expect(node.state.selected).toBeUndefined();
		});

		it('remains deselected', () => {
			const state = new NavState();
			expect(state.selected).toBeUndefined();

			state.deselect();
			expect(state.selected).toBeUndefined();
		});
	});

	const testNextLeafShorthand = (dir: NavDirection) => {
		it('selects the next element', () => {
			const spiedParentGetNextLeaf = vi.fn<
				[child: NavNode, dir: NavDirection],
				NavNode | undefined
			>(function (this: NavNode) {
				return this.children[1];
			});
			const parent = new NavNode(undefined, {
				getNextLeaf: spiedParentGetNextLeaf,
			});

			const current = new NavNode(parent, {});
			parent.children[0] = current;

			const spiedOtherOnSelect =
				vi.fn<[options?: NavSelectOptions | undefined]>();
			const other = new NavNode(parent, {
				onSelect: spiedOtherOnSelect,
			});
			parent.children[1] = other;

			expect(parent.state).toBeInstanceOf(NavState);
			parent.state.selected = current;

			parent.state[dir]();
			expect(parent.state.selected).toBe(other);
			expect(spiedParentGetNextLeaf).toBeCalledWith(current, dir);
			expect(spiedOtherOnSelect).toBeCalled();
		});

		it('passes options to the node', () => {
			const parent = new NavNode(undefined, {
				getNextLeaf() {
					return this.children[1];
				},
			});

			const current = new NavNode(parent, {});
			parent.children[0] = current;

			const spiedOtherOnSelect =
				vi.fn<[options?: NavSelectOptions | undefined]>();
			const other = new NavNode(parent, {
				onSelect: spiedOtherOnSelect,
			});
			parent.children[1] = other;

			expect(parent.state).toBeInstanceOf(NavState);
			parent.state.selected = current;

			parent.state[dir]({focusVisible: true});
			expect(spiedOtherOnSelect).toBeCalledWith({focusVisible: true});
		});
	};

	describe('next', () => {
		testNextLeafShorthand('next');
	});

	describe('up', () => {
		testNextLeafShorthand('up');
	});

	describe('down', () => {
		testNextLeafShorthand('down');
	});

	describe('left', () => {
		testNextLeafShorthand('left');
	});

	describe('right', () => {
		testNextLeafShorthand('right');
	});
});
