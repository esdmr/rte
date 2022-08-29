/**
 * This file is adapted from {@link https://togithub.com/molefrog/wouter}.
 * @license ISC By Alexey Taktarov
 */
import {cloneElement, type FunctionComponent, isValidElement, type JSX} from 'preact';
import {useCallback} from 'preact/hooks';
import {useLocation, useRouter} from 'wouter-preact';
import {getUrl} from '../wouter-hash.js';

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
		href: getUrl(href, base).hash,
		onClick: handleClick,
	};

	const jsx = isValidElement(children) ? children : <a {...props} />;
	return cloneElement(jsx, extraProps);
};
