#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import {createWriteStream} from 'node:fs';
import assert from 'node:assert';
import process from 'node:process';
import {execaCommand} from 'execa';
import {h} from 'preact';
import icon from '@mdi/react';
import parseAuthor from 'parse-author';
import {readWantedLockfile} from '@pnpm/lockfile-file';
import {mdiArrowLeft} from '@mdi/js';
import render from '../render.js';
import Document from '../components/document.js';
import {isProduction} from '../constants.js';
import LoadableDetails from './components/loadable-details.js';
import {getLicenseInfo} from './components/license.js';
import Package from './components/package.js';

await fs.mkdir('build', {recursive: true});
await fs.rm('build/licenses', {force: true, recursive: true});
await fs.mkdir('build/licenses', {recursive: true});

const onlyProduction = Boolean(process.env.ONLY_PROD);

/** @type {Map<string, Map<string, import('./components/license.js').LicenseOptions>>} */
const packages = new Map();

/** @type {Record<string, Partial<import('./components/license.js').LicenseOptions>>} */
const overrides = {
	'preact@10.10.6': {authors: new Set(['Jason Miller'])},
};

const unusedOverrides = new Set(Object.keys(overrides));
const lockfile = await readWantedLockfile('', {ignoreIncompatible: false});

if (lockfile === null) {
	throw new TypeError('Expected a lockfile, got null instead');
}

const pnpmDirs = Object.entries(lockfile.packages ?? {})
	.sort(([a], [b]) => a.localeCompare(b, 'en'))
	.map(([pkgPath, snapshot]) => {
		const [, name, version]
			= /^\/((?:@[^/]+\/)?[^/]+)\/(.+)$/.exec(pkgPath) ?? [];

		assert(name);
		assert(version);

		return /** @type {const} */ ([
			path.join(
				'node_modules/.pnpm',
				`${name}@${version}`.replace(/\//g, '+'),
				'node_modules',
				name,
			),
			snapshot,
		]);
	});

await Promise.all(
	pnpmDirs.map(async ([pkgDir, {dev}]) => {
		if (onlyProduction && dev) {
			return;
		}

		const {
			name,
			version,
			license: pkgLicense,
			licenses: pkgLicenses,
			author: pkgAuthor,
			contributors: pkgContributors,
			maintainers: pkgMaintainers,
		} = JSON.parse(
			await fs.readFile(path.join(pkgDir, 'package.json'), 'utf8'),
		);

		const pkgId = `${name}@${version}`;
		const authors = new Set(
			[pkgAuthor ?? '', ...(pkgContributors ?? []), ...(pkgMaintainers ?? [])]
				.map(contrib => getContributorName(contrib))
				.filter(Boolean),
		);
		const {license, licensePath} = getLicenseInfo(
			pkgLicense,
			pkgLicenses,
			pkgDir,
			pkgId,
		);

		if (licensePath) {
			const target = path.join('build/licenses', pkgId);
			await fs.mkdir(path.dirname(target), {recursive: true});
			await fs.cp(licensePath, target);
		} else if (license && !Array.isArray(license)) {
			const dir = await fs.readdir(pkgDir);

			if (dir.some(item => /license/i.test(item))) {
				console.log(
					`${pkgId} might have a license file that I could not find. Take a look at`,
					pkgDir,
				);
			}
		}

		/** @type {Map<string, import('./components/license.js').LicenseOptions>} */
		const licenses = packages.get(name) ?? new Map();
		packages.set(name, licenses);

		licenses.set(version, {
			name,
			version,
			dev: onlyProduction ? undefined : dev ?? false,
			authors,
			license,
			...overrides[pkgId],
		});

		unusedOverrides.delete(pkgId);
	}),
);

if (unusedOverrides.size > 0) {
	console.warn('Unused overrides:', unusedOverrides);
}

const children = [];

for (const [name, licenses] of packages) {
	children.push(h(Package, {name, licenses: [...licenses.values()]}));
}

const pnpmList = execaCommand('pnpm ls --depth Infinity', {
	env: {
		NODE_ENV: onlyProduction ? 'production' : 'development',
	},
});
const licenseIndexLog = createWriteStream('build/licenses/index.log');
pnpmList.stdout?.pipe(licenseIndexLog);
await pnpmList;

if (!licenseIndexLog.writableEnded) {
	licenseIndexLog.end();
}

await fs.writeFile(
	'build/licenses/index.html',
	render(
		h(
			Document,
			{
				csp: 'default-src \'self\';object-src \'none\';',
				robots: 'noindex,nofollow',
				base: '/licenses/',
				title: 'Licenses',
				head: [
					h('link', {rel: 'stylesheet', href: 'index.css'}),
					h('script', {defer: true, src: 'index.js'}),
				],
			},
			h(
				'header',
				null,
				h(
					'nav',
					null,
					h(
						'a',
						{
							href: '/',
							class: 'circular-button',
						},
						h(icon.default, {path: mdiArrowLeft, title: 'Back', size: '1em'}),
					),
				),
			),
			h('h1', null, 'Licenses'),
			h(
				LoadableDetails,
				{url: 'index.log'},
				h('code', null, 'pnpm ls --depth Infinity'),
			),
			children,
		),
	),
);

/**
 * @typedef {string | URL} PathLike
 * @type {(target: PathLike, path: PathLike) => Promise<void>}
 */
const copy = isProduction
	? fs.cp
	: (target, path) => fs.symlink(target, path, 'junction');

await copy(
	new URL('assets/browser.css', import.meta.url),
	'build/licenses/index.css',
);
await copy(
	new URL('assets/browser.js', import.meta.url),
	'build/licenses/index.js',
);

console.log('Done fetching the licenses.');

/** @param {string | {name?: string | null} | null} author */
function getContributorName(author) {
	return (
		(typeof author === 'string' ? parseAuthor(author).name : author?.name) || ''
	);
}
