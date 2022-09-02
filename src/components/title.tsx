import {FunctionComponent, toChildArray} from 'preact';
import {useEffect} from 'preact/hooks';
import assert from '../assert.js';

let set = false;

export const Title: FunctionComponent<{children: string | string[]}> = props => {
	const title = (toChildArray(props.children) as string[]).join('');

	useEffect(() => {
		assert(!set);
		set = true;
		const originalTitle = document.title;
		document.title = title;

		return () => {
			set = false;
			document.title = originalTitle;
		};
	}, [title]);

	return null;
};
