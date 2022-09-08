import {defineConfig} from 'vite';
import prefresh from '@prefresh/vite';
import {defaultImport} from 'default-import';
import inspect from 'vite-plugin-inspect';
import cssImport from './vite/css-import.js';
import preactDebug from './vite/preact-debug.js';
import typedCssModules from './vite/typed-css-modules.js';
import updateLicenses from './vite/licenses.js';

export default defineConfig(({command}) => ({
	base: '',
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
		defaultImport(inspect)(),
		preactDebug,
		cssImport,
		prefresh(),
		typedCssModules,
		updateLicenses,
	],
}));