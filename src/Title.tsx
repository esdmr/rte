import {type FunctionComponent, toChildArray} from 'preact';
import {useContext, useEffect} from 'preact/hooks';
import {pageStateContext} from './page-state/global.js';

export const Title: FunctionComponent<{
	children: string | string[];
	h1?: boolean;
}> = (props) => {
	const title = (toChildArray(props.children) as string[]).join('');
	const pageState = useContext(pageStateContext);

	useEffect(() => {
		pageState.title = title;

		return () => {
			pageState.title = '';
		};
	}, [title, pageState]);

	return props.h1 ? <h1>{title}</h1> : null;
};
