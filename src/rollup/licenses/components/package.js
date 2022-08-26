import {h, Fragment} from 'preact';
import License from './license.js';

/**
 * @typedef {Object} PackageOptions
 * @prop {string} name
 * @prop {import('./license.js').LicenseOptions[]} licenses
 */
/** @type {import('preact').FunctionComponent<PackageOptions>} */
const Package = props =>
	h(
		Fragment,
		null,
		h('h2', null, h('code', null, props.name)),
		props.licenses.map(options => h(License, options)),
	);

export default Package;
