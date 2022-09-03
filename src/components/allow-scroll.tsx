import type {FunctionComponent} from 'preact';
import {useEffect} from 'preact/hooks';
import assert from '../assert.js';

let set = false;

export const AllowScroll: FunctionComponent = () => {
	useEffect(() => {
		assert(!set, 'more than one AllowScroll in the render tree');
		set = true;
		document.body.classList.add('scroll');

		return () => {
			set = false;
			document.body.classList.remove('scroll');
		};
	}, []);

	return null;
};