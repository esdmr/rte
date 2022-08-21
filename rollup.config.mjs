import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {fileURLToPath} from 'node:url';
import commonjs from '@rollup/plugin-commonjs';
import htmlPlugin, {makeHtmlAttributes} from '@rollup/plugin-html';
import nodeResolve from '@rollup/plugin-node-resolve';
import {minify} from 'html-minifier';
import postcssUrl from 'postcss-url';
import {cacheBuild} from 'rollup-cache';
import esbuild from 'rollup-plugin-esbuild';
import monaco from 'rollup-plugin-monaco-editor';
import postcss from 'rollup-plugin-postcss';
import {typescriptPaths} from 'rollup-plugin-typescript-resolve';

const isProduction = process.env.NODE_ENV === 'production';

/**
 * @param {TemplateStringsArray} template
 * @param {unknown[]} subs
 */
function html(template, ...subs) {
	const stringElements = [];
	const subsLength = subs.length;

	for (const [index, value] of template.entries()) {
		stringElements.push(value);

		if (index < subsLength) {
			stringElements.push(String(subs[index]));
		}
	}

	return minify(stringElements.join(''), {
		caseSensitive: false,
		collapseBooleanAttributes: true,
		collapseInlineTagWhitespace: true,
		collapseWhitespace: true,
		decodeEntities: true,
		minifyURLs: true,
		removeAttributeQuotes: true,
		removeRedundantAttributes: true,
		removeScriptTypeAttributes: true,
		removeStyleLinkTypeAttributes: true,
		sortAttributes: true,
	});
}

export default function getRollupOptions() {
	const dir = 'build';
	const publicPath = isProduction ? '/' : `/${dir}/`;

	const cwd = process.cwd();
	const __dirname = fileURLToPath(new URL('.', import.meta.url));

	if (path.join(cwd, dir) !== path.join(__dirname, dir)) {
		throw new Error(`Incorrect working directory: ${cwd}. Expected: ${__dirname}`);
	}

	if (fs.existsSync(dir)) {
		fs.rmSync(dir, {recursive: true});
	}

	/** @type {import('rollup').RollupOptions} */
	const config = {
		input: 'src/index.tsx',
		output: {
			dir,
			format: 'esm',
			compact: true,
			generatedCode: 'es2015',
			interop: 'auto',
			sourcemap: true,
		},
		strictDeprecations: true,
		treeshake: true,
		preserveEntrySignatures: false,
		plugins: [
			isProduction && {
				name: 'preact-debug',
				resolveId(source) {
					if (source === 'preact/debug') {
						return '\0preact/debug';
					}

					return null;
				},
				load(id) {
					if (id === '\0preact/debug') {
						return '';
					}

					return null;
				},
			},
			nodeResolve({
				extensions: ['.js', '.mjs', '.cjs', '.ts', '.mts', '.cts', '.json'],
				browser: true,
			}),
			typescriptPaths(),
			postcss({
				minimize: isProduction,
				sourceMap: !isProduction,
				extract: true,
				plugins: [
					postcssUrl({
						url(asset) {
							if (!/\.ttf$/.test(asset.url)) {
								return asset.url;
							}

							const buildPath = path.join(process.cwd(), dir);
							const fontsPath = path.join(buildPath, 'fonts');
							fs.mkdirSync(fontsPath, {recursive: true});
							const targetFontPath = path.join(fontsPath, asset.pathname);
							fs.cpSync(asset.absolutePath, targetFontPath);
							const relativePath = path.relative(process.cwd(), targetFontPath);
							return `${publicPath}${relativePath}`;
						},
					}),
				],
			}),
			monaco({
				languages: ['javascript'],
				features: ['bracketMatching', 'wordHighlighter'],
				esm: false,
				sourcemap: false,
			}),
			commonjs(),
			esbuild({
				jsx: 'transform',
				jsxFactory: 'h',
				jsxFragment: 'Fragment',
				minify: true,
				minifyIdentifiers: isProduction,
				keepNames: !isProduction,
				target: ['firefox103', 'chrome105'],
			}),
			htmlPlugin({
				meta: [
					// eslint-disable-next-line unicorn/text-encoding-identifier-case
					{charset: 'UTF-8'},
					{'http-equiv': 'X-UA-Compatible', content: 'IE=edge'},
					{
						name: 'Content-Security-Policy',
						content: 'default-src \'self\';'
							+ 'base-uri \'none\';'
							+ 'object-src \'none\';',
					},
					{name: 'viewport', content: 'width=device-width, initial-scale=1.0'},
				],
				title: 'Gamepad Editor',
				publicPath,
				/**
				 * @param {Partial<import('@rollup/plugin-html').RollupHtmlTemplateOptions>} options
				 */
				template(options = {}) {
					console.log('Generated file types:', ...Object.keys(options.files ?? {}));

					const scriptList = [/^index\.js$/];
					const preloadList = [
						/^editor(-\w+)?\.js$/,
						/^editorSimpleWorker(-\w+)?\.js$/,
						/^javascript(-\w+)?\.js$/,
					];

					const scripts = options.files?.js?.map(({fileName}) => {
						if (scriptList.some(r => r.test(fileName))) {
							const attributes = makeHtmlAttributes({
								...options.attributes?.script,
								src: `${options.publicPath ?? ''}${fileName}`,
							});

							return html`
								<script ${attributes}></script>
							`;
						}

						if (preloadList.some(r => r.test(fileName))) {
							const attributes = makeHtmlAttributes({
								...options.attributes?.preload ?? '',
								rel: 'preload',
								href: `${options.publicPath ?? ''}${fileName}`,
								as: 'script',
							});

							return html`
								<link ${attributes} crossorigin>
							`;
						}

						return '';
					}).join('\n') ?? '';

					const links = options.files?.css?.map(({fileName}) => {
						const attributes = makeHtmlAttributes({
							...options.attributes?.link ?? '',
							rel: 'stylesheet',
							href: `${options.publicPath ?? ''}${fileName}`,
						});

						return html`
							<link ${attributes}>
						`;
					}).join('\n') ?? '';

					const meta = options.meta?.map(input => {
						const attributes = makeHtmlAttributes(input);
						return html`<meta ${attributes}>`;
					}).join('\n') ?? '';

					const attributes = makeHtmlAttributes(options.attributes?.html);

					return html`
						<!DOCTYPE html>
						<html ${attributes}>
							<head>
								${meta}
								<title>${options.title ?? ''}</title>
								${links}
								${scripts}
							</head>
							<body>
							</body>
						</html>
					`;
				},
			}),
		],
	};

	return cacheBuild(
		{
			name: 'main',
		},
		config,
	);
}
