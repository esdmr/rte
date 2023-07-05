import {assert, describe, expect, it} from 'vitest';
import {useContext} from 'preact/hooks';
import {render} from '@testing-library/preact';
import {CompLayer, compLayer, useCompLayer} from './layer.js';
import {CompPage} from './page.js';
import {lastRender, setTestRenderer} from './test-renderer.js';
import {CompList} from './list.js';

setTestRenderer();

describe('CompLayer', () => {
	describe('constructor', () => {
		it('disallows element to be document.body', () => {
			expect(
				() => new CompLayer(document.body),
			).toThrowErrorMatchingInlineSnapshot(
				'"Assertion failed: Refusing to initialize compositor layer at document body"',
			);
		});

		it('sets tabindex to -1', () => {
			expect(new CompLayer()._element.tabIndex).toBe(-1);
		});

		it('clears the role', () => {
			const element = document.createElement('div');
			element.setAttribute('role', 'alertdialog');
			void new CompLayer(element);
			expect(element.hasAttribute('role')).toBe(false);
		});
	});

	describe('activeDescendant', () => {
		it('is the current node', () => {
			const node = new CompLayer();
			expect(node.activeDescendant).toBe(node);
		});
	});

	describe('parent', () => {
		it('throws during rendering', () => {
			const node = new CompLayer();
			let called = false;

			const Component = () => {
				called = true;
				expect(() => node.parent).toThrowErrorMatchingInlineSnapshot(
					'"Assertion failed: accessed the parent of layer while rendering"',
				);
				return null;
			};

			node.render(<Component />);
			expect(called).toBe(true);
			node.dispose();
		});
	});

	describe('findNearest', () => {
		it('throws during rendering', () => {
			const node = new CompLayer();
			let called = false;

			const Component = () => {
				called = true;
				expect(() =>
					node.findNearest(CompPage),
				).toThrowErrorMatchingInlineSnapshot(
					'"Assertion failed: accessed the parent of layer while rendering"',
				);
				return null;
			};

			node.render(<Component />);
			expect(called).toBe(true);
			node.dispose();
		});
	});

	describe('render', () => {
		it('calls the renderer', () => {
			const layer = new CompLayer();
			let called = false;

			CompLayer._renderer = (vnode, element) => {
				called = true;
				expect(vnode).toBe('Greetings.');
				expect(element).toBe(layer._element);
			};

			layer.render('Greetings.');
			expect(called).toBe(true);
		});

		it('wraps vNodes with compLayer provider', () => {
			const layer = new CompLayer();
			let called = false;

			const Component = () => {
				called = true;
				const context = useContext(compLayer);
				expect(context).toBe(layer);
				return null;
			};

			layer.render(<Component />);
			expect(called).toBe(true);
			layer.dispose();
		});
	});

	describe('blur', () => {
		it('removes focus from the element', () => {
			const layer = new CompLayer();
			document.body.append(layer._element);
			layer._element.focus();
			expect(document.activeElement).toBe(layer._element);
			layer.blur();
			expect(document.activeElement).not.toBe(layer._element);
			layer._element.remove();
		});
	});

	describe('focus', () => {
		it('gives focus to the element', () => {
			const layer = new CompLayer();
			document.body.append(layer._element);
			layer._element.blur();
			expect(document.activeElement).not.toBe(layer._element);
			layer.focus();
			expect(document.activeElement).toBe(layer._element);
			layer._element.remove();
		});
	});

	describe('dispose', () => {
		it('dispatches the LayerDispose event', () => {
			const layer = new CompLayer();
			let called = false;

			layer.addEventListener('LayerDispose', () => {
				called = true;
			});

			layer.dispose();
			expect(called).toBe(true);
		});

		it('clears rendered elements', () => {
			const layer = new CompLayer();
			layer.render(<h1>Hello</h1>);
			assert(lastRender);
			expect(lastRender.container.childElementCount).toBeGreaterThan(0);
			layer.dispose();
			expect(lastRender.container.childElementCount).toBe(0);
		});

		it('removes itself from the parent (if any)', () => {
			const list = new CompList<CompLayer>();
			const layer = new CompLayer();
			list.append(layer);
			layer.dispose();
			expect(list.childrenCount).toBe(0);
		});
	});
});

describe('useCompLayer', () => {
	it('throws if not inside the compositor', () => {
		const Component = () => {
			expect(() => useCompLayer()).toThrowErrorMatchingInlineSnapshot(
				'"Assertion failed: Called outside of the compositor"',
			);
			return null;
		};

		render(<Component />);
	});

	it('returns the compositor layer associated with the current render', () => {
		const layer = new CompLayer();

		const Component = () => {
			expect(useCompLayer()).toBe(layer);
			return null;
		};

		layer.render(<Component />);
		layer.dispose();
	});
});
