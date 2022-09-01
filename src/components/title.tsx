import {FunctionComponent, toChildArray} from 'preact';
import {useEffect} from 'preact/hooks';
import assert from '../assert.js';

let titleIsSet = false;

export const Title: FunctionComponent<{children: string | string[]}> = props => {
	const title = (toChildArray(props.children) as string[]).join('');

	useEffect(() => {
		assert(!titleIsSet);
		titleIsSet = true;
		const originalTitle = document.title;
		document.title = title;

		return () => {
			titleIsSet = false;
			document.title = originalTitle;
		};
	}, [title]);

	return null;
};
