import html_ from '@rollup/plugin-html';
import {defaultImport} from 'default-import';
import {h} from 'preact';
import {Document} from '../components/document.js';
import {getOutputHash} from '../hash.js';
import render from '../render.js';

/**
 * @param {Object} options
 * @param {string} options.title
 * @param {string} [options.lang]
 * @param {string} [options.charSet]
 * @param {string} [options.csp]
 * @param {string} [options.robots]
 * @param {string} [options.base]
 *
 * @param {string} [options.fileName]
 * @param {string} options.publicPath
 * @param {RegExp[]} options.scriptList
 * @param {RegExp[]} options.preloadList
 * @param {RegExp[]} options.stylesheetList
 * @returns {import('rollup').Plugin}
 */
export default function html(options) {
	return defaultImport(html_)({
		fileName: options.fileName ?? 'index.html',
		/**
		 * @param {Partial<import('@rollup/plugin-html').RollupHtmlTemplateOptions>} template
		 */
		template({files = {}} = {}) {
			console.log('Generated file types:', ...Object.keys(files ?? {}));

			const scripts
				= files.js?.map(output => {
					if (options.scriptList.some(r => r.test(output.fileName))) {
						return h('script', {
							type: 'module',
							src: `${options.publicPath}${output.fileName}`,
						});
					}

					if (options.preloadList.some(r => r.test(output.fileName))) {
						return h('link', {
							rel: 'preload',
							href: `${options.publicPath}${output.fileName}`,
							as: 'script',
							crossOrigin: '',
						});
					}

					return undefined;
				}) ?? [];

			const stylesheets
				= files.css?.map(output => {
					if (options.stylesheetList.some(r => r.test(output.fileName))) {
						return h('link', {
							rel: 'stylesheet',
							href: `${options.publicPath}${output.fileName}`,
							integrity: getOutputHash(output).integrity,
						});
					}

					return undefined;
				}) ?? [];

			return render(
				h(Document, {
					...options,
					head: [...stylesheets, ...scripts],
				}),
			);
		},
	});
}
