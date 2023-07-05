import {describe, expect, it} from 'vitest';
import {CompPageContent} from './page-content.js';
import {pageContent} from './page.module.css';

describe('CompPageContent', () => {
	describe('constructor', () => {
		it('has the correct class', () => {
			const content = new CompPageContent();
			expect([...content.classList]).toContain(pageContent);
		});
	});
});
