/**
 * This file is adapted from {@link https://togithub.com/molefrog/wouter}.
 * @license ISC By Alexey Taktarov
 */
import type {FunctionComponent, JSX} from 'preact';
import {useCallback} from 'preact/hooks';
import {Button} from './navigation/wrappers.js';
import {CompPage, type CompPageBuilder} from './composition/page.js';
import {useCompLayer} from './composition/layer.js';
import assert from './assert.js';

type LinkProps = JSX.IntrinsicElements['button'] & {
	builder: CompPageBuilder;
	newParameters?: any;
	replace?: boolean;
};

type LinkClickHandler = NonNullable<LinkProps['onClick']>;

/** @deprecated */
export const Link: FunctionComponent<LinkProps> = ({
	builder,
	newParameters,
	onClick,
	replace = false,
	...props
}) => {
	const layer = useCompLayer();

	const handleClick = useCallback<LinkClickHandler>(
		function (event) {
			if (
				event.ctrlKey ||
				event.metaKey ||
				event.altKey ||
				event.shiftKey ||
				event.button !== 0
			) {
				return;
			}

			if (typeof onClick === 'function') {
				onClick.call(this, event);
			}

			if (!event.defaultPrevented) {
				event.preventDefault();
				const page = layer.findNearest(CompPage);
				assert(page, 'Not in a page');

				if (replace) {
					builder.replace(
						page,
						undefined,
						newParameters as Partial<any>,
					);
				} else {
					builder.after(
						page,
						undefined,
						newParameters as Partial<any>,
					);
				}
			}
		},
		[builder, onClick, replace],
	);

	const extraProps = {
		onClick: handleClick,
	};

	return <Button {...props} {...extraProps} />;
};
