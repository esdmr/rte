import {h, Fragment} from 'preact';
import {License} from './license.js';

/**
 * @typedef {Object} PackageProps
 * @prop {string} name
 * @prop {import('./license.js').LicenseProps[]} licenses
 */
/** @type {import('preact').FunctionComponent<PackageProps>} */
export const Package = props =>
	h(
		Fragment,
		null,
		h('h2', null, h('code', null, props.name)),
		props.licenses.map(options => h(License, options)),
	);
