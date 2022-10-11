import {describe, expect, it, vi} from 'vitest';
import {main} from './404.js';

describe('404', () => {
	const currentUrl = new URL(location.href);
	const oldHref = currentUrl.href;

	vi.stubGlobal('location', {
		get hostname() {
			return currentUrl.hostname;
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
		location.replace('/some/path');
		main();
		expect(location.href).toBe(new URL('/#/some/path', oldHref).href);
	});

	it('disregards hash and query string', () => {
		location.replace('/some/path?a=b#/cde/d');
		main();
		expect(location.href).toBe(new URL('/#/some/path', oldHref).href);
	});

	it('redirects github pages to hash', () => {
		location.replace('https://esdmr.github.io/example/some/path');
		main();
		expect(location.href).toBe(
			new URL('https://esdmr.github.io/example/#/some/path').href,
		);
	});

	it('disregards hash and query string in github pages', () => {
		location.replace('https://esdmr.github.io/example/some/path?a=b#/cde/d');
		main();
		expect(location.href).toBe(
			new URL('https://esdmr.github.io/example/#/some/path').href,
		);
	});
});
