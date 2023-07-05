import {assert, describe, expect, it} from 'vitest';
import {CompPage, CompPageBuilder} from './page.js';
import {CompDialog} from './dialog.js';
import {lastRender, setTestRenderer} from './test-renderer.js';
import {CompWindow} from './window.js';

setTestRenderer();

describe('CompPage', () => {
	describe('content', () => {
		it('is the page content', () => {
			const page = new CompPage();
			expect(page.content).toBe(page.get('content'));
		});

		it('throws if page does not have content', () => {
			const page = new CompPage();
			page.delete('content');
			expect(() => page.content).toThrowErrorMatchingInlineSnapshot(
				'"Assertion failed: Page is missing its contents"',
			);
		});
	});

	describe('dialogs', () => {
		it('is the dialog list', () => {
			const page = new CompPage();
			expect(page.dialogs).toBe(page.get('dialogs'));
		});

		it('throws if page does not have a dialog list', () => {
			const page = new CompPage();
			page.delete('dialogs');
			expect(() => page.dialogs).toThrowErrorMatchingInlineSnapshot(
				'"Assertion failed: Page is missing its dialog list"',
			);
		});
	});

	describe('constructor', () => {
		it('sets inert attribute on all but last layer', () => {
			const page = new CompPage();
			const a = new CompDialog();
			expect(page.content.inert).toBe(false);
			page.dialogs.append(a);
			expect(page.content.inert).toBe(true);
			expect(a.inert).toBe(false);
		});
	});

	describe('activeDescendant', () => {
		it('is the activeDescendant of the dialog list, falling back to page content', () => {
			const page = new CompPage();
			const a = new CompDialog();
			expect(page.activeDescendant).toBe(page.content);
			page.dialogs.append(a);
			expect(page.activeDescendant).toBe(a);
		});
	});
});

describe('CompPageBuilder', () => {
	describe('copy', () => {
		it('should return a new builder', () => {
			const builder = new CompPageBuilder(() => null, {});
			builder.classList.push('a', 'b');
			builder.showPageCloseButton = false;

			const newBuilder = builder.copy();

			expect(newBuilder.content).toBe(builder.content);
			expect(newBuilder.parameters).toBe(builder.parameters);
			expect(newBuilder.classList.join(' ')).toBe('a b');
			expect(newBuilder.showPageCloseButton).toBe(false);
		});
	});

	describe('replace', () => {
		it('adds element to the page', () => {
			const window = new CompWindow();
			const page = new CompPage();
			window.pages.append(page);
			const newPage = new CompPageBuilder(() => <div />, {}).replace(
				page,
			);
			expect(window.pages.children).toEqual([newPage]);
		});
	});

	describe('replaceOnClick', () => {
		it('adds element to the page', () => {
			const window = new CompWindow();
			const page = new CompPage();
			window.pages.append(page);
			const newPage = new CompPageBuilder(
				() => <div />,
				{},
			).replaceOnClick(page.content)();
			expect(window.pages.children).toEqual([newPage]);
		});
	});

	describe('after', () => {
		it('adds element to the page', () => {
			const window = new CompWindow();
			const page = new CompPage();
			window.pages.append(page);
			const newPage = new CompPageBuilder(() => <div />, {}).after(page);
			assert(lastRender);
			expect(lastRender.container.childElementCount).toBe(1);
			expect(window.pages.childrenCount).toBe(2);
			expect(window.pages.lastChild).toBe(newPage);
		});
	});

	describe('afterOnClick', () => {
		it('adds element to the page', () => {
			const window = new CompWindow();
			const page = new CompPage();
			window.pages.append(page);
			const newPage = new CompPageBuilder(() => <div />, {}).afterOnClick(
				page.content,
			)();
			assert(lastRender);
			expect(lastRender.container.childElementCount).toBe(1);
			expect(window.pages.childrenCount).toBe(2);
			expect(window.pages.lastChild).toBe(newPage);
		});
	});

	describe('append', () => {
		it('adds element to the page', () => {
			const window = new CompWindow();
			new CompPageBuilder(() => <div />, {}).append(window);
			assert(lastRender);
			expect(lastRender.container.childElementCount).toBe(1);
			expect(window.pages.childrenCount).toBe(1);
		});
	});
});
