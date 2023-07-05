import {assert, describe, expect, it} from 'vitest';
import {CompList} from './list.js';
import {CompLayer} from './layer.js';

describe('CompList', () => {
	describe('constructor', () => {
		it('disallows element to be document.body', () => {
			expect(
				() => new CompList(document.body),
			).toThrowErrorMatchingInlineSnapshot(
				'"Assertion failed: Refusing to initialize compositor list at document body"',
			);
		});
	});

	describe('entries', () => {
		it('iterates over the children zipped with the index', () => {
			const list = new CompList();
			const a = new CompLayer();
			const b = new CompLayer();
			const c = new CompLayer();
			const stack = [a, b, c];
			list.append(...stack);
			let index = 0;

			for (const [i, node] of list.entries()) {
				assert(index < 3);
				expect(i).toBe(index);
				expect(node).toBe(stack[index]);
				index++;
			}
		});

		it('throws if a child is not a comp node', () => {
			const list = new CompList();
			list._element.append(document.createElement('span'));
			const iter = list.entries();
			expect(() => iter.next()).toThrowErrorMatchingInlineSnapshot(
				'"Assertion failed: Child of compositor list is not a compositor node"',
			);
		});
	});

	describe('keys', () => {
		it('iterates over the index of children', () => {
			const list = new CompList();
			const a = new CompLayer();
			const b = new CompLayer();
			const c = new CompLayer();
			list.append(a, b, c);
			let index = 0;

			for (const i of list.keys()) {
				assert(index < 3);
				expect(i).toBe(index);
				index++;
			}
		});

		it('throws if a child is not a comp node', () => {
			const list = new CompList();
			list._element.append(document.createElement('span'));
			const iter = list.keys();
			expect(() => iter.next()).toThrowErrorMatchingInlineSnapshot(
				'"Assertion failed: Child of compositor list is not a compositor node"',
			);
		});
	});

	describe('values', () => {
		it('iterates over the children', () => {
			const list = new CompList();
			const a = new CompLayer();
			const b = new CompLayer();
			const c = new CompLayer();
			const stack = [a, b, c];
			list.append(...stack);
			expect([...list.values()]).toEqual(stack);
		});

		it('throws if a child is not a comp node', () => {
			const list = new CompList();
			list._element.append(document.createElement('span'));
			const iter = list.values();
			expect(() => iter.next()).toThrowErrorMatchingInlineSnapshot(
				'"Assertion failed: Child of compositor list is not a compositor node"',
			);
		});
	});

	describe('Symbol.iterator', () => {
		it('iterates over the children', () => {
			const list = new CompList();
			const a = new CompLayer();
			const b = new CompLayer();
			const c = new CompLayer();
			const stack = [a, b, c];
			list.append(...stack);
			expect([...list]).toEqual(stack);
		});

		it('throws if a child is not a comp node', () => {
			const list = new CompList();
			list._element.append(document.createElement('span'));
			const iter = list.values();
			expect(() => iter.next()).toThrowErrorMatchingInlineSnapshot(
				'"Assertion failed: Child of compositor list is not a compositor node"',
			);
		});
	});

	describe('children', () => {
		it('is a list of children', () => {
			const list = new CompList();
			const a = new CompLayer();
			const b = new CompLayer();
			const c = new CompLayer();
			const stack = [a, b, c];
			list.append(...stack);
			expect(list.children).toEqual(stack);
		});

		it('throws if a child is not a comp node', () => {
			const list = new CompList();
			list._element.append(document.createElement('span'));
			expect(() => list.children).toThrowErrorMatchingInlineSnapshot(
				'"Assertion failed: Child of compositor list is not a compositor node"',
			);
		});
	});

	describe('firstChild', () => {
		it('is the first child', () => {
			const list = new CompList();
			const a = new CompLayer();
			const b = new CompLayer();
			const c = new CompLayer();
			list.append(a, b, c);
			expect(list.firstChild).toBe(a);
		});

		it('is undefined if empty', () => {
			const list = new CompList();
			expect(list.firstChild).toBeUndefined();
		});

		it('throws if child is not a comp node', () => {
			const list = new CompList();
			list._element.append(document.createElement('span'));
			expect(() => list.firstChild).toThrowErrorMatchingInlineSnapshot(
				'"Assertion failed: Child of compositor list is not a compositor node"',
			);
		});
	});

	describe('lastChild', () => {
		it('is the last child', () => {
			const list = new CompList();
			const a = new CompLayer();
			const b = new CompLayer();
			const c = new CompLayer();
			list.append(a, b, c);
			expect(list.lastChild).toBe(c);
		});

		it('is undefined if empty', () => {
			const list = new CompList();
			expect(list.lastChild).toBeUndefined();
		});

		it('throws if child is not a comp node', () => {
			const list = new CompList();
			list._element.append(document.createElement('span'));
			expect(() => list.lastChild).toThrowErrorMatchingInlineSnapshot(
				'"Assertion failed: Child of compositor list is not a compositor node"',
			);
		});
	});

	describe('hasChildren', () => {
		it('is true if list has children', () => {
			const list = new CompList();
			const a = new CompLayer();
			const b = new CompLayer();
			const c = new CompLayer();
			list.append(a, b, c);
			expect(list.hasChildren).toBe(true);
		});

		it('is false if list is empty', () => {
			const list = new CompList();
			expect(list.hasChildren).toBe(false);
		});
	});

	describe('childrenCount', () => {
		it('is the number of children', () => {
			const list = new CompList();
			const a = new CompLayer();
			const b = new CompLayer();
			const c = new CompLayer();
			list.append(a, b, c);
			expect(list.childrenCount).toBe(3);
		});

		it('is zero if list is empty', () => {
			const list = new CompList();
			expect(list.childrenCount).toBe(0);
		});
	});

	describe('activeDescendant', () => {
		it('is the activeDescendant of the last child', () => {
			const list = new CompList();
			const a = new CompLayer();
			const b = new CompLayer();
			const c = new CompLayer();
			list.append(a, b, c);
			expect(list.activeDescendant).toBe(c.activeDescendant);
		});

		it('is undefined if list is empty', () => {
			const list = new CompList();
			expect(list.activeDescendant).toBeUndefined();
		});
	});

	describe('before', () => {
		it('adds the new nodes before some reference node', () => {
			const list = new CompList();
			const a = new CompLayer();
			const b = new CompLayer();
			const c = new CompLayer();
			const d = new CompLayer();
			list.append(a, b);
			list.before(b, c, d);
			expect(list.children).toEqual([a, c, d, b]);
		});
	});

	describe('after', () => {
		it('adds the new nodes before some reference node', () => {
			const list = new CompList();
			const a = new CompLayer();
			const b = new CompLayer();
			const c = new CompLayer();
			const d = new CompLayer();
			list.append(a, b);
			list.after(a, c, d);
			expect(list.children).toEqual([a, c, d, b]);
		});
	});

	describe('append', () => {
		it('adds the new nodes before some reference node', () => {
			const list = new CompList();
			const a = new CompLayer();
			const b = new CompLayer();
			list.append(a);
			list.append(b);
			expect(list.children).toEqual([a, b]);
		});
	});

	describe('prepend', () => {
		it('adds the new nodes before some reference node', () => {
			const list = new CompList();
			const a = new CompLayer();
			const b = new CompLayer();
			list.prepend(b);
			list.prepend(a);
			expect(list.children).toEqual([a, b]);
		});
	});

	describe('replace', () => {
		it('adds the new nodes before some reference node', () => {
			const list = new CompList();
			const a = new CompLayer();
			const b = new CompLayer();
			const c = new CompLayer();
			const d = new CompLayer();
			list.append(a, b);
			list.replace(b, c, d);
			expect(list.children).toEqual([a, c, d]);
		});
	});

	describe('remove', () => {
		it('removes a child', () => {
			const list = new CompList();
			const a = new CompLayer();
			const b = new CompLayer();
			list.append(a, b);
			list.remove(a);
			expect(list.children).toEqual([b]);
		});
	});

	describe('dispose', () => {
		it('disposes the children', () => {
			const list = new CompList();
			const a = new CompLayer();
			list.append(a);
			list.dispose();
			expect(list.childrenCount).toBe(0);
		});

		it('removes itself from the parent (if any)', () => {
			const outer = new CompList<CompList>();
			const inner = new CompList();
			outer.append(inner);
			inner.dispose();
			expect(outer.childrenCount).toBe(0);
		});
	});
});
