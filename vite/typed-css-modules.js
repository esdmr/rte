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

/** @type {readonly string[]} */
const files = await new Promise((resolve) => {
	find.file(/\.module\.css$/, 'src', resolve);
});

const newCreator = () =>
	new (defaultImport(DtsCreator))({
		camelCase: 'dashes',
		dropExtension: false,
		outDir: path.join('build', 'types'),
		namedExports: true,
	});

/**
 * @param {string} file
 */
const writeTypes = async (file, creator = newCreator()) => {
	const content = await creator.create(file);

	Object.defineProperty(content, 'outputFileName', {
		get() {
			return this.rInputPath.replace(/\.css$/, '') + '.d.css.ts';
		},
	});

	await content.writeFile();
};

const buildAll = async () => {
	console.log('Building the css module types...');
	const creator = newCreator();
	await Promise.all(files.map(async (file) => writeTypes(file, creator)));
	console.log('Done building the css module types.');
};

export default definePlugin({
	name: 'typed-css-modules',
	async buildStart() {
		for (const file of files) {
			this.addWatchFile(file);
		}
	},
	async configureServer(server) {
		server.watcher.on('change', (path) => {
			if (path.endsWith('.css')) {
				console.log(path, 'was changed. Updating its types...');
				writeTypes(path).catch(console.error);
			}
		});

		await buildAll();
	},
	async closeBundle() {
		await buildAll();
	},
});
