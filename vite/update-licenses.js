#!/usr/bin/env node
/**
 * @typedef {import('../src/license-types.js').Package} Package
 * @typedef {import('../src/license-types.js').License} License
 * @typedef {import('../src/license-types.js').LegacyLicense} LegacyLicense
 */
import assert from 'node:assert';
import process from 'node:process';
import {existsSync} from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {readWantedLockfile} from '@pnpm/lockfile-file';
import parseAuthor from 'parse-author';

const integrity = getIntegrity(await fs.readFile('pnpm-lock.yaml'));

if (await isBuildUpToDate(integrity)) {
	console.log('License files up to date. Ignoring.');
	process.exit(0);
}

await fs.mkdir('build', {recursive: true});
await fs.rm('build/license-files', {force: true, recursive: true});
await fs.mkdir('build/license-files', {recursive: true});

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
	.filter(([, snapshot]) => !snapshot.dev)
	.sort(([a], [b]) => a.localeCompare(b, 'en'))
	.map(([pkgPath, snapshot]) => {
		const [, name, version] = /^\/((?:@.+?\/)?.+?)\/(.+)$/.exec(pkgPath) ?? [];

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
				console.warn(
					'Optional package',
					`${snapshot.name}@${snapshot.version}`,
					'was not found',
				);
				return;
			}

			console.error(
				`Required package ${snapshot.name}@${snapshot.version} was not found`,
			);
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
		const authors = [
			...new Set(
				[pkgAuthor, ...pkgContributors, ...pkgMaintainers]
					.map((contrib) => getContributorName(contrib))
					.filter(Boolean),
			),
		];
		const {license, licensePath} = getLicenseInfo(
			pkgLicense,
			pkgLicenses,
			pkgDir,
		);

		if (licensePath) {
			const target = path.join('build/license-files', pkgId);
			await fs.mkdir(path.dirname(target), {recursive: true});
			await fs.cp(licensePath, target);
		} else if (license && !Array.isArray(license)) {
			const dir = await fs.readdir(pkgDir);

			if (dir.some((item) => /license/i.test(item))) {
				console.log(
					pkgId,
					'might have a license file that I could not find. Take a look at',
					pkgDir,
				);
			}
		}

		packages.set(pkgId, {
			name,
			version,
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

const deps = [...packages.values()].sort((a, b) =>
	`${a.name}@${a.version}`.localeCompare(`${b.name}@${b.version}`, 'en-US'),
);

await fs.writeFile(
	'build/license-files/deps.json',
	JSON.stringify(deps) + '\n',
);
await fs.writeFile('build/license-files/.integrity', integrity + '\n');

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
	const integrityFile = 'build/license-files/.integrity';

	if (!existsSync(integrityFile)) {
		return false;
	}

	const buildIntegrity = await fs.readFile(integrityFile, 'utf8');

	return integrity.trim() === buildIntegrity.trim();
}

/**
 * @param {import('node:crypto').BinaryLike} content
 */
function getIntegrity(content) {
	return 'sha256-' + createHash('sha256').update(content).digest('base64');
}

/**
 * @param {unknown} pkgLicense
 * @param {unknown} pkgLicenses
 * @param {string} pkgDir
 * @returns {{license: License, licensePath: string | undefined}}
 */
function getLicenseInfo(pkgLicense, pkgLicenses, pkgDir) {
	if (typeof pkgLicense !== 'string') {
		const licenses = /** @type {LegacyLicense['entries']} */ (
			[pkgLicense, pkgLicenses]
				.flat()
				.filter(
					(license) =>
						typeof license === 'object' &&
						license !== null &&
						'type' in license &&
						'url' in license,
				)
		);

		if (licenses.length === 0) {
			const licenseFile = tryFindLicenseFile(pkgDir);
			return {
				license: {type: licenseFile ? 'custom' : 'unknown'},
				licensePath: licenseFile,
			};
		}

		return {
			license: {type: 'legacy', entries: licenses},
			licensePath: undefined,
		};
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
