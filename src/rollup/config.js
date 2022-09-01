import fs from 'node:fs/promises';
import path from 'node:path';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import postcssUrl from 'postcss-url';
import {cacheBuild} from 'rollup-cache';
import esbuild from 'rollup-plugin-esbuild';
import monaco from 'rollup-plugin-monaco-editor';
import postcss from 'rollup-plugin-postcss';
import {typescriptPaths} from 'rollup-plugin-typescript-resolve';
import {defaultImport} from 'default-import';
import injectProcessEnv from 'rollup-plugin-inject-process-env';
import {buildDir, isProduction} from './constants.js';
import html from './plugins/html.js';
import licenses from './plugins/licenses.js';
import preactDebug from './plugins/preact-debug.js';
import typedCssModules from './plugins/typed-css-modules.js';

await fs.rm(buildDir, {force: true, recursive: true});
await fs.mkdir(buildDir, {recursive: true});

if (!isProduction) {
	await fs.symlink('src', path.join(buildDir, 'src'), 'junction');
	await fs.symlink(
		'node_modules',
		path.join(buildDir, 'node_modules'),
		'junction',
	);
}

/** @type {import('rollup').RollupOptions} */
const config = {
	input: ['src/index.tsx', 'src/404.ts'],
	output: {
		dir: buildDir,
		assetFileNames: 'assets/[name]-[hash][extname]',
		entryFileNames: '[name]-[hash].js',
		format: 'esm',
		compact: true,
		generatedCode: 'es2015',
		interop: 'auto',
		sourcemap: !isProduction,
	},
	strictDeprecations: true,
	treeshake: true,
	preserveEntrySignatures: false,
	plugins: [
		isProduction && preactDebug(),
		{
			name: 'css-import',
			resolveId(source, importer, options) {
				if (source.endsWith('.css.js')) {
					return this.resolve(source.slice(0, -3), importer, {
						...options,
						skipSelf: true,
					});
				}

				return null;
			},
		},
		defaultImport(nodeResolve)({
			extensions: ['.js', '.mjs', '.cjs', '.ts', '.mts', '.cts', '.json'],
			browser: true,
		}),
		typescriptPaths(),
		defaultImport(postcss)({
			minimize: isProduction,
			sourceMap: !isProduction,
			modules: {
				generateScopedName: '[local]_[sha256:hash:hex:8]',
				localsConvention: 'dashesOnly',
			},
			namedExports(name) {
				return name.replace(/-\w/g, value => value.slice(1).toUpperCase());
			},
			plugins: [
				postcssUrl({
					url: 'copy',
					assetsPath: path.resolve(buildDir, 'assets'),
					useHash: true,
					hashOptions: {
						append: true,
					},
				}),
			],
		}),
		defaultImport(monaco)({
			languages: ['javascript'],
			features: ['bracketMatching', 'wordHighlighter'],
			esm: false,
			sourcemap: false,
		}),
		defaultImport(commonjs)(),
		defaultImport(injectProcessEnv)({
			NODE_ENV: isProduction ? 'production' : 'development',
		}, {
			exclude: ['**/*.css', 'src/404.ts'],
		}),
		defaultImport(esbuild)({
			jsx: 'automatic',
			jsxImportSource: 'preact',
			minify: true,
			minifyIdentifiers: isProduction,
			keepNames: !isProduction,
			treeShaking: true,
			target: ['firefox103', 'chrome105'],
		}),
		html({
			title: 'Gamepad Editor',
			publicPath: '/',
			scriptList: [/^index(-\w+)?\.js$/],
			preloadList: [
				/^editor(-\w+)?\.js$/,
				/^editorSimpleWorker(-\w+)?\.js$/,
				/^javascript(-\w+)?\.js$/,
			],
			stylesheetList: [],
			csp: 'default-src \'self\';base-uri \'none\';object-src \'none\';',
		}),
		html({
			title: 'SPA Redirect',
			fileName: '404.html',
			publicPath: '/',
			scriptList: [/^404(-\w+)?\.js$/],
			preloadList: [],
			stylesheetList: [],
			csp: 'default-src \'self\';base-uri \'none\';object-src \'none\';',
			robots: 'noindex,nofollow',
		}),
		!isProduction && typedCssModules(),
		licenses(),
	],
};

export default cacheBuild(
	{
		name: 'main',
	},
	config,
);
