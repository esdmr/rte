import process from 'node:process';
import path from 'node:path';
import fs from 'node:fs';
import nodeResolve from '@rollup/plugin-node-resolve';
import copy from 'rollup-plugin-copy';
import esbuild from 'rollup-plugin-esbuild';
import {minify} from 'html-minifier';
import {typescriptPaths} from 'rollup-plugin-typescript-resolve';
import commonjs from '@rollup/plugin-commonjs';
import monaco from 'rollup-plugin-monaco-editor';
import postcss from 'rollup-plugin-postcss';
import {cacheBuild} from 'rollup-cache';
import postcssUrl from 'postcss-url';

const isProduction = process.env.NODE_ENV === 'production';

export default function getRollupOptions() {
	/** @type {import('rollup').RollupOptions} */
	const config = {
		input: 'src/index.tsx',
		output: {
			dir: 'build',
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
				minimize: true,
				sourceMap: false,
				plugins: [
					postcssUrl({
						url(asset) {
							if (!/\.ttf$/.test(asset.url)) {
								return asset.url;
							}

							const distPath = path.join(process.cwd(), 'build');
							const distFontsPath = path.join(distPath, 'fonts');
							fs.mkdirSync(distFontsPath, {recursive: true});
							const targetFontPath = path.join(distFontsPath, asset.pathname);
							fs.cpSync(asset.absolutePath, targetFontPath);
							const relativePath = path.relative(process.cwd(), targetFontPath);
							const publicPath = '/';
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
			copy({
				targets: [
					{
						src: 'src/index.html',
						dest: 'build',
						transform: content =>
							minify(content.toString(), {
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
							}),
					},
				],
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
