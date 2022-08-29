import {h} from 'preact';

/**
 * @typedef {Object} LoadableDetailsProps
 * @prop {string} url
 */
/** @type {import('preact').FunctionComponent<LoadableDetailsProps>} */
export const LoadableDetails = props =>
	h(
		'details',
		{'data-load-url': props.url},
		h('summary', {children: props.children}),
		h('pre', null),
	);
