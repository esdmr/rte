import type {FunctionComponent} from 'preact';

const listFormat = new Intl.ListFormat('en', {style: 'long'});

export const Authors: FunctionComponent<{list: readonly string[]}> = ({
	list,
}) => {
	if (list.length === 0) {
		return <>unknown authors</>;
	}

	const lastIndex = list.length - 1;

	const formattedAuthors = listFormat
		.formatToParts(list)
		.map((item, index) => {
			// Since `Authors` is followed by a period, make sure to prevent
			// double periods.
			const value =
				index === lastIndex
					? item.value.replace(/\.$/, '')
					: item.value;

			return item.type === 'element' ? <i>{value}</i> : value;
		});

	return <>{formattedAuthors}</>;
};
