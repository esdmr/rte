import html_ from '@rollup/plugin-html';
import {defaultImport} from 'default-import';
import {h} from 'preact';
import Document from '../components/document.js';
import {getOutputHash} from '../hash.js';
import render from '../render.js';

/**
 * @param {Object} options
 * @param {string} options.publicPath
 * @returns {import('rollup').Plugin}
 */
export default function html({publicPath}) {
	return defaultImport(html_)({
		meta: [],
		title: 'Gamepad Editor',
		publicPath,
		/**
		 * @param {Partial<import('@rollup/plugin-html').RollupHtmlTemplateOptions>} options
		 */
		template(options = {}) {
			console.log('Generated file types:', ...Object.keys(options.files ?? {}));

			const scriptList = [/^index(-\w+)?\.js$/];
			const preloadList = [
				/^editor(-\w+)?\.js$/,
				/^editorSimpleWorker(-\w+)?\.js$/,
				/^javascript(-\w+)?\.js$/,
			];

			const scripts
				= options.files?.js?.map(output => {
					if (scriptList.some(r => r.test(output.fileName))) {
						return h('script', {
							...options.attributes?.script,
							src: `${options.publicPath ?? ''}${output.fileName}`,
						});
					}

					if (preloadList.some(r => r.test(output.fileName))) {
						return h('link', {
							...options.attributes?.preload,
							rel: 'preload',
							href: `${options.publicPath ?? ''}${output.fileName}`,
							as: 'script',
							crossOrigin: true,
						});
					}

					return undefined;
				}) ?? [];

			const links
				= options.files?.css?.map(output =>
					h('link', {
						...options.attributes?.link,
						rel: 'stylesheet',
						href: `${options.publicPath ?? ''}${output.fileName}`,
						integrity: getOutputHash(output).integrity,
					}),
				) ?? [];

			const meta = options.meta?.map(input => h('meta', input)) ?? [];

			return render(
				h(Document, {
					lang: options.attributes?.html?.lang ?? 'en',
					csp: 'default-src \'self\';base-uri \'none\';object-src \'none\';',
					title: options.title ?? '',
					head: [...meta, ...links, ...scripts],
				}),
			);
		},
	});
}
