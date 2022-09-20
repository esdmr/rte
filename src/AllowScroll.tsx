import type {FunctionComponent} from 'preact';
import {useEffect} from 'preact/hooks';
import {usePageState} from './page-state/global.js';

export const AllowScroll: FunctionComponent = () => {
	const pageState = usePageState();

	useEffect(() => {
		pageState.root.classList.add('scroll');

		return () => {
			pageState.root.classList.remove('scroll');
		};
	}, [pageState]);

	return null;
};
