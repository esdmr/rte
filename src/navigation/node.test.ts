import {describe, expect, it} from 'vitest';
import {NavNode} from './node.js';
import {NavState} from './state.js';

describe('NavNode', () => {
	describe('selected', () => {
		it('should ignore that node is disposed', () => {
			const node = new NavNode(undefined, {});
			node.dispose();
			expect(node.selected).toBe(false);

			node.state.selected = node;
			expect(node.selected).toBe(true);
		});

		it('should check if the current node is selected', () => {
			const parent = new NavNode(undefined, {});
			const child = new NavNode(parent, {});

			expect(parent.state.selected).toBeUndefined();
			expect(parent.selected).toBe(false);
			expect(child.selected).toBe(false);

			parent.state.selected = child;
			expect(parent.selected).toBe(false);
			expect(child.selected).toBe(true);

			parent.state.selected = parent;
			expect(parent.selected).toBe(true);
			expect(child.selected).toBe(false);
		});
	});

	describe('get ref', () => {
		it('returns the current referred element', () => {
			const node = new NavNode(undefined, {});
			expect(node.ref).toBeUndefined();

			const ref = document.createElement('div');
			node.ref = ref;
			expect(node.ref).toBe(ref);

			node.dispose();
		});
	});

	describe('set ref', () => {
		it('sets the current referred element', () => {
			const node = new NavNode(undefined, {});

			const ref = document.createElement('div');
			node.ref = ref;
			expect(node.ref).toBe(ref);

			node.ref = undefined;
			expect(node.ref).toBeUndefined();
		});

		it('updates the elementToNode map', () => {
			const node = new NavNode(undefined, {});

			const ref = document.createElement('div');
			node.ref = ref;
			expect(ref);

			node.ref = undefined;
		});
	});

	describe('state', () => {
		it('is a instance of NavState', () => {
			const node = new NavNode(undefined, {});
			expect(node.state).toBeInstanceOf(NavState);
		});

		it('inherits the instance from the parent', () => {
			const parent = new NavNode(undefined, {});
			const child = new NavNode(parent, {});

			expect(child.state).toBe(parent.state);
		});
	});

	describe('getPath', () => {
		if (import.meta.env.DEV) {
			it('returns a string', () => {
				const node = new NavNode(undefined, {});
				expect(node._getPath?.()).toBeTypeOf('string');
			});
		} else {
			it('is undefined', () => {
				const node = new NavNode(undefined, {});
				expect(node._getPath).toBeUndefined();
			});
		}
	});
});
