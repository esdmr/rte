import {describe, expect, it} from 'vitest';
import {CompPage} from './page.js';
import {CompPageList} from './page-list.js';

describe('CompPageList', () => {
	describe('constructor', () => {
		it('sets hidden attribute on all but last child', () => {
			const list = new CompPageList();
			const a = new CompPage();
			const b = new CompPage();
			list.append(a, b);
			expect(a.hidden).toBe(true);
			expect(b.hidden).toBe(false);
			b.dispose();
			expect(a.hidden).toBe(false);
		});
	});
});
