import type {FunctionComponent} from 'preact';
import {useContext, useEffect} from 'preact/hooks';
import {pageStateContext} from './page-state/global.js';

export const AllowScroll: FunctionComponent = () => {
	const pageState = useContext(pageStateContext);

	useEffect(() => {
		pageState.root.classList.add('scroll');

		return () => {
			pageState.root.classList.remove('scroll');
		};
	}, [pageState]);

	return null;
};
