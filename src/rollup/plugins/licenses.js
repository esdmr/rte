import {fileURLToPath} from 'node:url';
import {execaNode} from 'execa';

const scriptPath = fileURLToPath(
	new URL('../licenses/fetch.js', import.meta.url),
);

/** @returns {import('rollup').Plugin} */
export default function licenses() {
	return {
		name: 'licenses',
		async closeBundle() {
			console.log('Fetching the licenses...');
			await execaNode(scriptPath, {
				stdio: 'inherit',
				env: {
					ONLY_PROD: 'true',
				},
			});
		},
	};
}
