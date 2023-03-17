import process from 'node:process';
import {defineConfig} from 'vite';
import prefresh from '@prefresh/vite';
import strip from '@rollup/plugin-strip';
import {defaultImport} from 'default-import';
import inspect from 'vite-plugin-inspect';
import environment from 'vite-plugin-environment';
import cssImport from './vite/css-import.js';
import preactDebug from './vite/preact-debug.js';
import typedCssModules from './vite/typed-css-modules.js';
import updateLicenses from './vite/licenses.js';

/** @param {string} url */
const ensureTrailingSlash = (url) => (url.endsWith('/') ? url : url + '/');

export default defineConfig(({command}) => ({
	base: ensureTrailingSlash(
		process.env.RTE_BASE_URL ?? process.env.BASE_URL ?? '/',
	),
	cacheDir: 'node_modules/.cache/vite',
	css: {
		devSourcemap: true,
		modules: {
			generateScopedName: '[local]_[sha256:hash:hex:8]',
			localsConvention: 'dashesOnly',
		},
	},
	esbuild: {
		jsx: 'automatic',
		jsxImportSource: 'preact',
		jsxDev: command !== 'build',
		minifyIdentifiers: command === 'build',
		keepNames: command !== 'build',
		treeShaking: true,
	},
	build: {
		target: ['firefox103', 'chrome104'],
		outDir: 'build',
		rollupOptions: {
			input: ['index.html', '404.html'],
		},
	},
	server: {
		port: 12_345,
		strictPort: true,
		cors: false,
	},
	preview: {
		port: 12_345,
		strictPort: true,
		cors: false,
	},
	plugins: [
		environment(['RTE_TREE_URL', 'RTE_BLOB_URL'], {
			defineOn: 'import.meta.env',
		}),
		defaultImport(inspect)({
			build: false,
			outputDir: 'node_modules/.cache/vite-inspect',
		}),
		preactDebug,
		cssImport,
		command === 'build' &&
			defaultImport(strip)({
				functions: [
					'performance.mark',
					'performance.measure',
					'console.debug',
				],
				include: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
			}),
		prefresh(),
		typedCssModules,
		updateLicenses,
	],
	define: {
		'import.meta.vitest': 'undefined',
	},
	test: {
		environment: 'jsdom',
		css: true,
		coverage: {
			all: true,
			skipFull: true,
			reporter: 'lcov',
			src: 'src',
			exclude: [
				'**/*.test.*',
				'**/*.d.ts',
				'src/license-types.ts',
				'src/components/icons/gamepad/face-button/types.ts',
			],
		},
		cache: {
			dir: 'node_modules/.cache/vitest',
		},
		mockReset: true,
	},
}));
