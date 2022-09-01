/**
 * This file is adapted from {@link https://togithub.com/molefrog/wouter}.
 * @license ISC By Alexey Taktarov
 */
import {useCallback, useEffect, useRef, useState} from 'preact/hooks';
import type {BaseLocationHook} from 'wouter-preact';
import history from './history.js';

export const useHashLocation: BaseLocationHook = () => {
	const [path, update] = useState(history.location.pathname);
	const hash = useRef(path);

	useEffect(() => {
		const checkForUpdates = (reason: string) => {
			const newPath = history.location.pathname;
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

		const stop = history.listen(() => {
			checkForUpdates('listen');
		});

		checkForUpdates('initial');

		return () => {
			stop();
		};
	}, []);

	const navigate = useCallback((to: string, {replace = false} = {}) => {
		history[replace ? 'replace' : 'push'](to);
	}, []);

	return [path, navigate];
};
