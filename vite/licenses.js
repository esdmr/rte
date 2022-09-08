import {fileURLToPath} from 'node:url';
import {execaNode} from 'execa';
import sirv from 'sirv';
import {definePlugin} from './plugin-helper.js';

const scriptPath = fileURLToPath(
	new URL('update-licenses.js', import.meta.url),
);

let isBuild = true;

export default definePlugin({
	name: 'licenses',
	enforce: 'post',
	buildStart() {
		this.addWatchFile('pnpm-lock.yaml');
	},
	async configureServer(server) {
		server.watcher.add('pnpm-lock.yaml');

		server.watcher.on('change', (path) => {
			if (path === 'pnpm-lock.yaml') {
				updateLicenses().catch(console.error);
			}
		});

		await updateLicenses();
		isBuild = false;

		const licenseFilesRoute = sirv('build/license-files', {
			extensions: [],
			dev: true,
		});

		server.middlewares.use('/license-files', licenseFilesRoute);
	},
	async closeBundle() {
		if (isBuild) {
			await updateLicenses();
		}
	},
});

async function updateLicenses() {
	console.log('Fetching the licenses...');
	return execaNode(scriptPath, {
		stdio: 'inherit',
		env: {
			ONLY_PROD: 'true',
		},
	});
}
