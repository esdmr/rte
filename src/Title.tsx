import {type FunctionComponent, toChildArray} from 'preact';
import {useEffect} from 'preact/hooks';
import assert from './assert.js';

let set = false;

export const Title: FunctionComponent<{
	children: string | string[];
	h1?: boolean;
}> = (props) => {
	const title = (toChildArray(props.children) as string[]).join('');

	useEffect(() => {
		assert(!set, 'more than one Title in the render tree');
		set = true;
		const originalTitle = document.title;
		document.title = `${title} - ${originalTitle}`;

		return () => {
			set = false;
			document.title = originalTitle;
		};
	}, [title]);

	return props.h1 ? <h1>{title}</h1> : null;
};
