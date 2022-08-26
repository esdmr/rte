import {h} from 'preact';

/**
 * @typedef {Object} LoadableDetailsOptions
 * @prop {string} url
 */
/** @type {import('preact').FunctionComponent<LoadableDetailsOptions>} */
const LoadableDetails = props =>
	h(
		'details',
		{'data-load-url': props.url},
		h('summary', {children: props.children}),
		h('pre', null),
	);

export default LoadableDetails;
