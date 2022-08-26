import {h} from 'preact';

/**
 * @typedef {Object} DocumentOptions
 * @prop {string} title
 * @prop {string} [lang]
 * @prop {string} [charSet]
 * @prop {string} [csp]
 * @prop {string} [robots]
 * @prop {string} [base]
 * @prop {import('preact').ComponentChildren} [head]
 */
/** @type {import('preact').FunctionComponent<DocumentOptions>} */
const Document = props =>
	h(
		'html',
		{lang: props.lang ?? 'en'},
		h(
			'head',
			null,
			// eslint-disable-next-line unicorn/text-encoding-identifier-case
			h('meta', {charSet: props.charSet ?? 'UTF-8'}),
			h('meta', {'http-equiv': 'X-UA-Compatible', content: 'IE=edge'}),
			props.csp
				&& h('meta', {
					name: 'Content-Security-Policy',
					content: props.csp,
				}),
			h('meta', {
				name: 'viewport',
				content: 'width=device-width, initial-scale=1.0',
			}),
			props.robots && h('meta', {name: 'robots', content: props.robots}),
			props.base && h('base', {href: props.base}),
			h('title', null, props.title),
			props.head,
		),
		h('body', {children: props.children}),
	);
export default Document;
