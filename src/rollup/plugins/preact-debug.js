/** @returns {import('rollup').Plugin} */
export default function preactDebug() {
	return {
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
	};
}
