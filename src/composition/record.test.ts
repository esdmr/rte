import {describe, expect, it} from 'vitest';
import {CompRecord} from './record.js';
import {CompLayer} from './layer.js';
import {setTestRenderer} from './test-renderer.js';
import {CompList} from './list.js';

setTestRenderer();

describe('CompRecord', () => {
	class CompOsiTuh extends CompRecord<Record<string, CompLayer>> {
		override get activeDescendant(): CompLayer | undefined {
			return undefined;
		}
	}

	describe('constructor', () => {
		it('sets up initial values', () => {
			const layer = new CompLayer();
			const record = new CompOsiTuh(undefined, {a: layer});
			expect(record.get('a')).toBe(layer);
		});
	});

	describe('entries', () => {
		it('iterates over the children zipped with their keys', () => {
			const a = new CompLayer();
			const b = new CompLayer();
			const c = new CompLayer();
			const record = new CompOsiTuh(undefined, {a, b, c});
			expect([...record.entries()]).toEqual([
				['a', a],
				['b', b],
				['c', c],
			]);
		});

		it('throws if a child is not a comp node', () => {
			const record = new CompOsiTuh();
			record._element.append(document.createElement('span'));
			const iter = record.entries();
			expect(() => iter.next()).toThrowErrorMatchingInlineSnapshot(
				'"Assertion failed: Non-compositor child found in compositor record"',
			);
		});

		it('does not throw if a child is not a comp node and at document.body', () => {
			const record = new CompOsiTuh(document.body);
			record._element.append(document.createElement('span'));
			expect([...record.entries()]).toEqual([]);
		});

		it('does not throw if a child does not have a key and at document.body', () => {
			const record = new CompOsiTuh(document.body);
			record._element.append(new CompLayer()._element);
			expect([...record.entries()]).toEqual([]);
		});
	});

	describe('keys', () => {
		it('iterates over the children keys', () => {
			const a = new CompLayer();
			const b = new CompLayer();
			const c = new CompLayer();
			const record = new CompOsiTuh(undefined, {a, b, c});
			expect([...record.keys()]).toEqual(['a', 'b', 'c']);
		});

		it('throws if a child is not a comp node', () => {
			const record = new CompOsiTuh();
			record._element.append(document.createElement('span'));
			const iter = record.keys();
			expect(() => iter.next()).toThrowErrorMatchingInlineSnapshot(
				'"Assertion failed: Non-compositor child found in compositor record"',
			);
		});

		it('does not throw if a child is not a comp node and at document.body', () => {
			const record = new CompOsiTuh(document.body);
			record._element.append(document.createElement('span'));
			expect([...record.keys()]).toEqual([]);
		});

		it('does not throw if a child does not have a key and at document.body', () => {
			const record = new CompOsiTuh(document.body);
			record._element.append(new CompLayer()._element);
			expect([...record.keys()]).toEqual([]);
		});
	});

	describe('values', () => {
		it('iterates over the children zipped with their keys', () => {
			const a = new CompLayer();
			const b = new CompLayer();
			const c = new CompLayer();
			const record = new CompOsiTuh(undefined, {a, b, c});
			expect([...record.values()]).toEqual([a, b, c]);
		});

		it('throws if a child is not a comp node', () => {
			const record = new CompOsiTuh();
			record._element.append(document.createElement('span'));
			const iter = record.values();
			expect(() => iter.next()).toThrowErrorMatchingInlineSnapshot(
				'"Assertion failed: Non-compositor child found in compositor record"',
			);
		});

		it('does not throw if a child is not a comp node and at document.body', () => {
			const record = new CompOsiTuh(document.body);
			record._element.append(document.createElement('span'));
			expect([...record.values()]).toEqual([]);
		});

		it('does not throw if a child does not have a key and at document.body', () => {
			const record = new CompOsiTuh(document.body);
			record._element.append(new CompLayer()._element);
			expect([...record.values()]).toEqual([]);
		});
	});

	describe('iterator', () => {
		it('iterates over the children zipped with their keys', () => {
			const a = new CompLayer();
			const b = new CompLayer();
			const c = new CompLayer();
			const record = new CompOsiTuh(undefined, {a, b, c});
			expect([...record]).toEqual([
				['a', a],
				['b', b],
				['c', c],
			]);
		});

		it('throws if a child is not a comp node', () => {
			const record = new CompOsiTuh();
			record._element.append(document.createElement('span'));
			const iter = record[Symbol.iterator]();
			expect(() => iter.next()).toThrowErrorMatchingInlineSnapshot(
				'"Assertion failed: Non-compositor child found in compositor record"',
			);
		});

		it('does not throw if a child is not a comp node and at document.body', () => {
			const record = new CompOsiTuh(document.body);
			record._element.append(document.createElement('span'));
			expect([...record]).toEqual([]);
		});

		it('does not throw if a child does not have a key and at document.body', () => {
			const record = new CompOsiTuh(document.body);
			record._element.append(new CompLayer()._element);
			expect([...record]).toEqual([]);
		});
	});

	describe('children', () => {
		it('is an object of children', () => {
			const a = new CompLayer();
			const b = new CompLayer();
			const c = new CompLayer();
			const stack = {a, b, c};
			const record = new CompOsiTuh(undefined, stack);
			expect(record.children).toEqual(stack);
		});

		it('throws if a child is not a comp node', () => {
			const record = new CompOsiTuh();
			record._element.append(document.createElement('span'));
			expect(() => record.children).toThrowErrorMatchingInlineSnapshot(
				'"Assertion failed: Non-compositor child found in compositor record"',
			);
		});

		it('throws if a child is not a comp node', () => {
			const record = new CompOsiTuh(document.body);
			record._element.append(document.createElement('span'));
			expect(record.children).toEqual({});
		});
	});

	describe('get', () => {
		it('returns undefined if it can not find it', () => {
			const record = new CompOsiTuh();
			expect(record.get('abc')).toBeUndefined();
		});

		it('returns the associated node', () => {
			const layer = new CompLayer();
			const record = new CompOsiTuh(undefined, {layer});
			expect(record.get('layer')).toBe(layer);
		});
	});

	describe('set', () => {
		it('sets a new key', () => {
			const record = new CompOsiTuh();
			const layer = new CompLayer();
			record.set('abc', layer);
			expect(record.get('abc')).toBe(layer);
		});

		it('returns the associated node', () => {
			const layer = new CompLayer();
			const record = new CompOsiTuh(undefined, {layer});
			const newLayer = new CompLayer();
			record.set('layer', newLayer);
			expect(record.get('layer')).toBe(newLayer);
		});
	});

	describe('delete', () => {
		it('does nothing if key is not found', () => {
			const record = new CompOsiTuh();
			record.delete('abc');
			expect(record.get('abc')).toBeUndefined();
		});

		it('deletes an entry', () => {
			const layer = new CompLayer();
			const record = new CompOsiTuh(undefined, {layer});
			record.delete('layer');
			expect(record.get('layer')).toBeUndefined();
		});
	});

	describe('remove', () => {
		it('deletes an entry given a node', () => {
			const layer = new CompLayer();
			const record = new CompOsiTuh(undefined, {layer});
			record.remove(layer);
			expect(record.get('layer')).toBeUndefined();
		});
	});

	describe('dispose', () => {
		it('disposes the children', () => {
			const a = new CompLayer();
			const record = new CompOsiTuh(undefined, {a});
			record.dispose();
			expect(a.parent).toBeUndefined();
		});

		it('removes itself from the parent (if any)', () => {
			const outer = new CompList<CompOsiTuh>();
			const inner = new CompOsiTuh();
			outer.append(inner);
			inner.dispose();
			expect(outer.childrenCount).toBe(0);
		});
	});
});
