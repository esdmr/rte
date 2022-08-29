/**
 * This file is adapted from {@link https://togithub.com/molefrog/wouter}.
 * @license ISC By Alexey Taktarov
 */
import {useCallback, useEffect, useRef, useState} from 'preact/hooks';
import type {BaseLocationHook} from 'wouter-preact';
import assert from './assert.js';

const eventPushState = 'pushState';
const eventReplaceState = 'replaceState';
const events = ['popstate', eventPushState, eventReplaceState, 'hashchange'];

if (typeof history !== 'undefined') {
	for (const type of [eventPushState, eventReplaceState] as const) {
		history[type] = new Proxy(history[type], {
			apply(...args) {
				const result: unknown = Reflect.apply(...args);
				globalThis.dispatchEvent(new Event(type));
				return result;
			},
		});
	}
}

const currentPathname = (base: string) => {
	const path = location.hash.replace(/^#!/, '') || '/';

	return path.toLowerCase().startsWith(base.toLowerCase())
		? path.slice(base.length) || '/'
		: '~' + path;
};

export const getUrl = (to: string, base: string) => {
	const url = new URL('/', location.href);
	url.hash = '#!' + (to.startsWith('~') ? to.slice(1) : base + to);
	return url;
};

export const useHashLocation: BaseLocationHook = ({base = '/'} = {}) => {
	assert(typeof base === 'string');

	const [path, update] = useState(currentPathname(base));
	const hash = useRef(path);

	useEffect(() => {
		const controller = new AbortController();

		const checkForUpdates = (reason: string) => {
			const newPath = currentPathname(base);
			const oldPath = hash.current;

			if (oldPath !== newPath) {
				hash.current = newPath;
				update(newPath);
				console.debug('Routed', {
					reason,
					old: oldPath,
					new: newPath,
				});
			}
		};

		for (const event of events) {
			addEventListener(event, () => {
				checkForUpdates(event);
			}, {signal: controller.signal});
		}

		checkForUpdates('initial');

		return () => {
			controller.abort();
		};
	}, [base]);

	const navigate = useCallback((to: string, {replace = false} = {}) => {
		const url = getUrl(to, base);

		history[replace ? eventReplaceState : eventPushState](
			null,
			'',
			url,
		);
	}, [base]);

	return [path, navigate];
};
