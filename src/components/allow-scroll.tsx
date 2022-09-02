import type {FunctionComponent} from 'preact';
import {useEffect} from 'preact/hooks';

let set = false;

export const AllowScroll: FunctionComponent = () => {
	useEffect(() => {
		set = true;
		document.body.classList.add('scroll');

		return () => {
			set = true;
			document.body.classList.remove('scroll');
		};
	}, []);

	return null;
};
