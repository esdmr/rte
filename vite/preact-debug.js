import {definePlugin} from './plugin-helper.js';

export default definePlugin({
	name: 'preact-debug',
	apply: 'build',
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
});
