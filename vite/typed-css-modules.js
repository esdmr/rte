/**
 * @see https://github.com/GoogleChromeLabs/proxx/blob/c6c1558/lib/css-module-types.js
 * @license
 * Copyright 2019 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import path from 'node:path';
import DtsCreator from 'typed-css-modules';
import find from 'find';
import {defaultImport} from 'default-import';
import {definePlugin} from './plugin-helper.js';

function newCreator() {
	return new (defaultImport(DtsCreator))({
		camelCase: 'dashes',
		dropExtension: false,
		outDir: path.join('build', 'types'),
		namedExports: true,
	});
}

/**
 * @param {string} file
 */
async function writeTypes(file, creator = newCreator()) {
	const content = await creator.create(file);
	await content.writeFile();
}

/** @type {string[]} */
let files;

export default definePlugin({
	name: 'typed-css-modules',
	async buildStart() {
		const creator = newCreator();

		files = await new Promise(resolve => {
			find.file(/\.module\.css$/, 'src', resolve);
		});

		const promises = files.map(async file => {
			this.addWatchFile(file);
			await writeTypes(file, creator);
		});

		await Promise.all(promises);
	},
	async watchChange(id) {
		if (id.endsWith('.css')) {
			await writeTypes(id);
		}
	},
	async configureServer(server) {
		server.watcher.add(files);

		server.watcher.on('change', path => {
			if (path.endsWith('.css')) {
				writeTypes(path).catch(console.error);
			}
		});
	},
});
