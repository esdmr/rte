import {definePlugin} from './plugin-helper.js';

export default definePlugin({
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
});
