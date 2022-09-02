/**
 * This file is adapted from {@link https://togithub.com/molefrog/wouter}.
 * @license ISC By Alexey Taktarov
 */
import type {FunctionComponent, JSX} from 'preact';
import {useCallback} from 'preact/hooks';
import {useLocation, useRouter} from 'wouter-preact';
import history from '../history.js';

type LinkProps = JSX.IntrinsicElements['a'] & {
	href: string;
	replace?: boolean;
};

type LinkClickHandler = NonNullable<LinkProps['onClick']>;

export const Link: FunctionComponent<LinkProps> = props => {
	const {base} = useRouter();
	const [, navigate] = useLocation();
	const {href, children, onClick, replace = false} = props;

	const handleClick = useCallback<LinkClickHandler>(
		function (event) {
			if (
				event.ctrlKey
				|| event.metaKey
				|| event.altKey
				|| event.shiftKey
				|| event.button !== 0
			) {
				return;
			}

			if (typeof onClick === 'function') {
				Reflect.apply(onClick, this, [event]);
			}

			if (!event.defaultPrevented) {
				event.preventDefault();
				navigate(href, {replace});
			}
		},
		[onClick],
	);

	const extraProps = {
		href: history.createHref(base + href),
		onClick: handleClick,
	};

	return <a {...props} {...extraProps} />;
};
