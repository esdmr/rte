import type {FunctionComponent} from 'preact';

const listFormat = new Intl.ListFormat('en', {style: 'long'});

export const Authors: FunctionComponent<{list: readonly string[]}> = ({
	list,
}) => {
	if (list.length === 0) {
		return <>unknown authors</>;
	}

	const formattedAuthors = listFormat
		.formatToParts(list)
		.map((item) =>
			item.type === 'element' ? <i>{item.value}</i> : item.value,
		);

	return <>{formattedAuthors}</>;
};
