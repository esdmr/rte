import {describe, expect, it} from 'vitest';
import {CompWindow} from './window.js';
import {CompPage} from './page.js';

describe('CompWindow', () => {
	describe('pages', () => {
		it('is the page list', () => {
			const window = new CompWindow();
			expect(window.pages).toBe(window.get('pages'));
		});

		it('throws if window does not have a page list', () => {
			const window = new CompWindow();
			window.delete('pages');
			expect(() => window.pages).toThrowErrorMatchingInlineSnapshot(
				'"Assertion failed: Window is missing its page list"',
			);
		});
	});

	describe('overlays', () => {
		it('is the overlay list', () => {
			const window = new CompWindow();
			expect(window.overlays).toBe(window.get('overlays'));
		});

		it('throws if window does not have a page list', () => {
			const window = new CompWindow();
			window.delete('overlays');
			expect(() => window.overlays).toThrowErrorMatchingInlineSnapshot(
				'"Assertion failed: Window is missing its overlay list"',
			);
		});
	});

	describe('activeDescendant', () => {
		it('is the activeDescendant of page list', () => {
			const window = new CompWindow();
			const page = new CompPage();
			window.pages.append(page);
			expect(window.activeDescendant).toBe(window.pages.activeDescendant);
		});
	});
});
