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
import {buildDir, isProduction, publicPath} from './constants.js';
import html from './plugins/html.js';
import licenses from './plugins/licenses.js';
import preactDebug from './plugins/preact-debug.js';

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
	input: 'src/index.tsx',
	output: {
		dir: buildDir,
		assetFileNames: 'assets/[name]-[hash][extname]',
		entryFileNames: '[name]-[hash].js',
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
		isProduction && preactDebug(),
		defaultImport(nodeResolve)({
			extensions: ['.js', '.mjs', '.cjs', '.ts', '.mts', '.cts', '.json'],
			browser: true,
		}),
		typescriptPaths(),
		defaultImport(postcss)({
			minimize: isProduction,
			sourceMap: !isProduction,
			extract: 'index.css',
			to: path.resolve(buildDir, 'index.css'),
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
		defaultImport(esbuild)({
			jsx: 'transform',
			jsxFactory: 'h',
			jsxFragment: 'Fragment',
			minify: true,
			minifyIdentifiers: isProduction,
			keepNames: !isProduction,
			target: ['firefox103', 'chrome105'],
		}),
		html({
			publicPath,
		}),
		licenses(),
	],
};

export default cacheBuild(
	{
		name: 'main',
	},
	config,
);
