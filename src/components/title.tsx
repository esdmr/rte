import {FunctionComponent, toChildArray} from 'preact';
import {useEffect} from 'preact/hooks';
import assert from '../assert.js';

let titleIsSet = false;

export const Title: FunctionComponent<{children: string | string[]}> = props => {
	useEffect(() => {
		assert(!titleIsSet);
		titleIsSet = true;
		const originalTitle = document.title;
		document.title = (toChildArray(props.children) as string[]).join('');

		return () => {
			titleIsSet = false;
			document.title = originalTitle;
		};
	});

	return null;
};
