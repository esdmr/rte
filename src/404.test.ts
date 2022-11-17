import {describe, expect, it, vi} from 'vitest';
import {main} from './404.js';

const baseUrl = new URL(import.meta.env.BASE_URL, 'https://example.com');
const createUrl = (url: string) => new URL(url, baseUrl);

describe('404', () => {
	const currentUrl = createUrl('');

	vi.stubGlobal('location', {
		get origin() {
			return currentUrl.origin;
		},
		get href() {
			return currentUrl.href;
		},
		get pathname() {
			return currentUrl.pathname;
		},
		replace(url: string | URL) {
			currentUrl.href = new URL(url, currentUrl).href;
		},
	});

	it('redirects pages to hash', () => {
		location.replace(createUrl('some/path'));
		main();
		expect(location.href).toBe(createUrl('#/some/path').href);
	});

	it('disregards hash and query string', () => {
		location.replace(createUrl('some/path?a=b#/cde/d'));
		main();
		expect(location.href).toBe(createUrl('#/some/path').href);
	});
});
