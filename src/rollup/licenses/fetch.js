#!/usr/bin/env node
/**
 * @typedef {import('../../license-types.js').Package} Package
 * @typedef {import('../../license-types.js').License} License
 * @typedef {import('../../license-types.js').LegacyLicense} LegacyLicense
 */
import assert from 'node:assert';
import process from 'node:process';
import {existsSync} from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import {readWantedLockfile} from '@pnpm/lockfile-file';
import parseAuthor from 'parse-author';
import {buildDir} from '../constants.js';
import {getIntegrity} from '../hash.js';

const integrity = getIntegrity(await fs.readFile('pnpm-lock.yaml'));

if (await isBuildUpToDate(integrity)) {
	console.log('License files up to date. Ignoring.');
	process.exit(0);
}

await fs.mkdir(buildDir, {recursive: true});
await fs.rm(path.join(buildDir, 'license-files'), {force: true, recursive: true});
await fs.mkdir(path.join(buildDir, 'license-files'), {recursive: true});

/** @type {Map<string, Package>} */
const packages = new Map();

/** @type {Record<string, Partial<Package>>} */
const overrides = {
	'preact@10.10.6': {authors: ['Jason Miller']},
};

const unusedOverrides = new Set(Object.keys(overrides));
const lockfile = await readWantedLockfile('', {ignoreIncompatible: false});
assert(lockfile !== null);

const pnpmDirs = Object.entries(lockfile.packages ?? {})
	.sort(([a], [b]) => a.localeCompare(b, 'en'))
	.map(([pkgPath, snapshot]) => {
		const [, name, version]
			= /^\/((?:@.+?\/)?.+?)\/(.+)$/.exec(pkgPath) ?? [];

		assert(name);
		assert(version);

		return /** @type {const} */ ([
			path.join(
				'node_modules/.pnpm',
				`${name}@${version}`.replace(/\//g, '+'),
				'node_modules',
				name,
			),
			{
				name,
				version,
				...snapshot,
			},
		]);
	});

await Promise.all(
	pnpmDirs.map(async ([pkgDir, snapshot]) => {
		if (!existsSync(pkgDir)) {
			if (snapshot.optional) {
				console.warn('Optional package', `${snapshot.name}@${snapshot.version}`, 'was not found');
				return;
			}

			console.error(`Required package ${snapshot.name}@${snapshot.version} was not found`);
			process.exitCode = 1;
			return;
		}

		const {
			name,
			version,
			license: pkgLicense,
			licenses: pkgLicenses,
			author: pkgAuthor = '',
			contributors: pkgContributors = [],
			maintainers: pkgMaintainers = [],
		} = JSON.parse(
			await fs.readFile(path.join(pkgDir, 'package.json'), 'utf8'),
		);

		const pkgId = `${name}@${version}`;
		const authors = [...new Set(
			[pkgAuthor, ...pkgContributors, ...pkgMaintainers]
				.map(contrib => getContributorName(contrib))
				.filter(Boolean),
		)];
		const {license, licensePath} = getLicenseInfo(
			pkgLicense,
			pkgLicenses,
			pkgDir,
		);

		if (licensePath) {
			const target = path.join(buildDir, 'license-files', pkgId);
			await fs.mkdir(path.dirname(target), {recursive: true});
			await fs.cp(licensePath, target);
		} else if (license && !Array.isArray(license)) {
			const dir = await fs.readdir(pkgDir);

			if (dir.some(item => /license/i.test(item))) {
				console.log(
					pkgId, 'might have a license file that I could not find. Take a look at',
					pkgDir,
				);
			}
		}

		packages.set(pkgId, {
			name,
			version,
			dev: snapshot.dev,
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

/** @type {Package[]} */
const prodJson = [];
/** @type {Package[]} */
const devJson = [];

for (const pkg of packages.values()) {
	if (pkg.dev) {
		devJson.push(pkg);
	} else {
		prodJson.push(pkg);
	}
}

await fs.writeFile(path.join(buildDir, 'license-files/prod.json'), JSON.stringify(prodJson) + '\n');
await fs.writeFile(path.join(buildDir, 'license-files/dev.json'), JSON.stringify(devJson) + '\n');
await fs.writeFile(path.join(buildDir, 'license-files/.integrity'), integrity + '\n');

console.log('Done fetching the licenses.');

/** @param {string | {name?: string | null} | null} author */
function getContributorName(author) {
	return (
		(typeof author === 'string' ? parseAuthor(author).name : author?.name) || ''
	);
}

/**
 * @param {string} integrity
 */
async function isBuildUpToDate(integrity) {
	const integrityFile = path.join(buildDir, 'license-files/.integrity');

	if (!existsSync(integrityFile)) {
		return false;
	}

	const buildIntegrity = await fs.readFile(integrityFile, 'utf8');

	return integrity.trim() === buildIntegrity.trim();
}

/**
 * @param {unknown} pkgLicense
 * @param {unknown} pkgLicenses
 * @param {string} pkgDir
 * @returns {{license: License, licensePath: string | undefined}}
 */
function getLicenseInfo(pkgLicense, pkgLicenses, pkgDir) {
	if (typeof pkgLicense !== 'string') {
		const licenses = /** @type {LegacyLicense[]} */(
			[pkgLicense, pkgLicenses]
				.flat()
				.filter(
					license =>
						typeof license === 'object'
							&& license !== null
							&& 'type' in license
							&& 'url' in license,
				)
		);

		if (licenses.length === 0) {
			const licenseFile = tryFindLicenseFile(pkgDir);
			return {
				license: licenseFile ? {type: 'custom'} : undefined,
				licensePath: licenseFile,
			};
		}

		return {license: licenses, licensePath: undefined};
	}

	const match = /^SEE LICENSE IN (.+)$/.exec(pkgLicense);

	if (match?.[1]) {
		return {
			license: {type: 'custom'},
			licensePath: path.join(pkgDir, match[1]),
		};
	}

	const licenseFile = tryFindLicenseFile(pkgDir);

	return {
		license: {
			type: 'spdx',
			id: pkgLicense,
			hasFile: Boolean(licenseFile),
		},
		licensePath: licenseFile,
	};
}

/**
 * @param {string} pkgDir
 */
function tryFindLicenseFile(pkgDir) {
	for (const file of [
		'LICENSE.md',
		'LICENSE',
		'LICENSE.txt',
		'license.md',
		'license',
		'license.txt',
		'LICENSE-MIT',
		'LICENSE-MIT.txt',
		'MIT-LICENSE.txt',
		'LICENSE.BSD',
		'License.md',
		'License',
		'License.txt',
	]) {
		if (existsSync(path.join(pkgDir, file))) {
			return path.join(pkgDir, file);
		}
	}

	return undefined;
}
