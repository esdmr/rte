import {toChildArray, type FunctionComponent} from 'preact';
import {useEffect} from 'preact/hooks';
import {usePageState} from './page-state/global.js';

export const Title: FunctionComponent<{
	children: string | readonly string[];
	h1?: boolean;
}> = (props) => {
	const title = toChildArray(props.children).join('');
	const pageState = usePageState();

	useEffect(() => {
		pageState.title = title;

		return () => {
			pageState.title = '';
		};
	}, [title, pageState]);

	return props.h1 ? <h1>{title}</h1> : null;
};
