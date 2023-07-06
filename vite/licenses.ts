import sirv from 'sirv';
import {definePlugin} from './plugin-helper.js';
import {updateAll} from './update-licenses.js';

let didBuild = false;

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
				updateAll().catch(console.error);
			}
		});

		await updateAll();
		didBuild = true;

		const licenseFilesRoute = sirv('build/licenses', {
			extensions: [],
			dev: true,
		});

		server.middlewares.use(
			`${server.config.base}licenses`,
			licenseFilesRoute,
		);
	},
	async closeBundle() {
		if (!didBuild) {
			await updateAll();
		}
	},
});
