#!/usr/bin/env node
/**
 * @typedef {import('../src/license-types.js').Package} Package
 * @typedef {import('../src/license-types.js').License} License
 * @typedef {import('../src/license-types.js').LegacyLicense} LegacyLicense
 * @typedef {import('../src/license-types.js').Patch} Patch
 * @typedef {import('@pnpm/lockfile-file').PackageSnapshot & {
 *   name: string;
 *   version: string;
 * }} PackageSnapshotExtended
 */
import assert from 'node:assert';
import {existsSync} from 'node:fs';
import fs from 'node:fs/promises';
import process from 'node:process';
import {readWantedLockfile} from '@pnpm/lockfile-file';
import parseAuthor from 'parse-author';
import {
	createDir,
	destroyDir,
	getIntegrity,
	isBuildUpToDate,
} from './plugin-helper.js';
import * as paths from './paths.js';

/** @type {Record<string, Partial<Package>>} */
const overrides = {
	preact: {authors: ['Jason Miller']},
	'@preact/signals-core': {authors: ['Preact Team']},
	'@preact/signals': {authors: ['Preact Team']},
	'prop-types': {authors: ['Facebook, Inc.']},
	'react-is': {authors: ['Facebook, Inc. and its affiliates']},
};

const licenseFileNames = [
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
];

{
	const depsIntegrity = await getDepsIntegrity();
	const patches = await getPatches();

	if (process.argv.includes('--rebuild')) {
		await destroyDir(paths.outDir);
	}

	await updateLicenseFiles();

	if (await isBuildUpToDate(paths.depsIntegrityFile, depsIntegrity)) {
		console.log('Dependency licenses are up to date. Ignoring.');
	} else {
		await updateDepsLicenses(depsIntegrity);
	}

	if (await isBuildUpToDate(paths.patchesIntegrityFile, patches.integrity)) {
		console.log('Patch licenses are up to date. Ignoring.');
	} else {
		await updatePatchesLicenses(patches);
	}
}

async function updateLicenseFiles() {
	await createDir(paths.licenseFilesDir);
	await fs.cp(paths.licensesDir, paths.licenseFilesDir, {recursive: true});
}

async function getDepsIntegrity() {
	return getIntegrity(await fs.readFile(paths.pnpmLockFile));
}

/**
 * @param {string} integrity
 */
async function updateDepsLicenses(integrity) {
	await destroyDir(paths.depsDir);
	await createDir(paths.depsDir);

	const unusedOverrides = new Set(Object.keys(overrides));
	const pnpmDirs = await getPnpmDirs();

	const packageList = await Promise.all(
		pnpmDirs.map(async ([pkgDir, snapshot]) =>
			processPnpmDir(pkgDir, snapshot, unusedOverrides),
		),
	);

	if (unusedOverrides.size > 0) {
		console.warn('Unused overrides:', unusedOverrides);
	}

	const packages = new Map(
		/** @type {[string, Package][]} */ (packageList.filter(Boolean)),
	);

	const deps = [...packages.entries()]
		.sort(([a], [b]) => a.localeCompare(b, 'en-US'))
		.map(([, pkg]) => pkg);

	await fs.writeFile(paths.depsIndexFile, JSON.stringify(deps) + '\n');
	await fs.writeFile(paths.depsIntegrityFile, integrity + '\n');
	console.log('Done fetching the dependency licenses.');
}

async function getPnpmDirs() {
	const lockfile = await readWantedLockfile('', {ignoreIncompatible: false});
	assert(lockfile !== null);

	return Object.entries(lockfile.packages ?? {})
		.filter(([, snapshot]) => !snapshot.dev)
		.sort(([a], [b]) => a.localeCompare(b, 'en'))
		.map(([pkgPath, snapshot]) => {
			const [, name, version] =
				/^\/((?:@.+?\/)?.+?)\/(.+)$/.exec(pkgPath) ?? [];

			assert(name);
			assert(version);

			const pkgId = `${name}@${version}`;

			return /** @type {[URL, PackageSnapshotExtended]} */ ([
				new URL(
					`node_modules/.pnpm/${pkgId.replace(
						/\//g,
						'+',
					)}/node_modules/${name}/`,
					paths.rootDir,
				),
				{
					...snapshot,
					name,
					version,
				},
			]);
		});
}

/**
 * @param {URL} pkgDir
 * @param {PackageSnapshotExtended} snapshot
 * @param {Set<string>} unusedOverrides
 */
async function processPnpmDir(pkgDir, snapshot, unusedOverrides) {
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
	} = JSON.parse(await fs.readFile(new URL('package.json', pkgDir), 'utf8'));

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

	const pkgId = `${name}@${version}`;

	if (licensePath) {
		const target = new URL(pkgId, paths.depsDir);
		await fs.mkdir(new URL('.', target), {recursive: true});
		await fs.cp(licensePath, target);
	} else if (license.type !== 'legacy') {
		const dir = await fs.readdir(pkgDir);

		if (dir.some((item) => /license/i.test(item))) {
			console.log(
				pkgId,
				'might have a license file that I could not find. Take a look at',
				pkgDir.pathname,
			);
		}
	}

	unusedOverrides.delete(name);
	unusedOverrides.delete(pkgId);

	return /** @type {[string, Package]} */ ([
		pkgId,
		{
			name,
			version,
			authors,
			license,
			...overrides[name],
			...overrides[pkgId],
		},
	]);
}

/** @param {string | {name?: string | null | undefined} | null | undefined} author */
function getContributorName(author) {
	return (
		(typeof author === 'string'
			? parseAuthor(author).name
			: author?.name) || ''
	);
}

/**
 * @param {unknown} pkgLicense
 * @param {unknown} pkgLicenses
 * @param {URL} pkgDir
 * @returns {{license: License, licensePath: URL | undefined}}
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
			licensePath: new URL(match[1], pkgDir),
		};
	}

	const licenseFile = tryFindLicenseFile(pkgDir);

	return {
		license: {
			type: 'spdx',
			id: pkgLicense,
			fileMissing: licenseFile ? undefined : true,
		},
		licensePath: licenseFile,
	};
}

/**
 * @param {URL} pkgDir
 */
function tryFindLicenseFile(pkgDir) {
	return licenseFileNames
		.map((i) => new URL(i, pkgDir))
		.find((i) => existsSync(i));
}

/**
 * @typedef {Awaited<ReturnType<typeof getPatches>>} PatchesInfo
 */
async function getPatches() {
	const pkg = JSON.parse(await fs.readFile(paths.packageFile, 'utf8'));

	/** @type {Record<string, string>} */
	const patches = Object.fromEntries(
		Object.entries(pkg.pnpm.patchedDependencies).map(([a, b]) => [b, a]),
	);

	const dep5 = await fs.readFile(paths.dep5File, 'utf8');

	/** @type {ReadonlyArray<Record<string, string>>} */
	const rulesArray = dep5
		.trim()
		.split('\n\n')
		.slice(1)
		.map((i) =>
			Object.fromEntries(
				i
					.split(/\n(?!\t)/g)
					.map((i) => i.replace(/\s+/g, ' ').split(': ')),
			),
		);

	/** @type {Record<string, {copyright: string; patchBy: string; license: string}>} */
	const rules = Object.create(null);

	for (const stanza of rulesArray) {
		if (
			!stanza.Files ||
			!stanza.Copyright ||
			!stanza['X-Patch-By'] ||
			!stanza.License
		) {
			console.info('Skipping over dep5 stanza:', stanza);
			continue;
		}

		for (const glob of stanza.Files.split(' ')) {
			if (!Object.hasOwn(patches, glob)) {
				continue;
			}

			rules[glob] = {
				copyright: stanza.Copyright,
				patchBy: stanza['X-Patch-By'],
				license: stanza.License,
			};
		}
	}

	for (const patch of Object.keys(patches)) {
		if (!(patch in rules)) {
			console.error('Patch', patch, 'is not in the dep5 rules');
			process.exitCode = 1;
		}
	}

	const integrity = getIntegrity(JSON.stringify(rules));

	return {patches, rules, integrity};
}

/**
 * @param {PatchesInfo} info
 */
async function updatePatchesLicenses({patches, rules, integrity}) {
	await destroyDir(paths.patchesDir);
	await createDir(paths.patchesDir);

	/** @type {readonly Patch[]} */
	const index = Object.entries(rules).map(
		([path, {copyright, patchBy, license}]) => {
			const originalAuthors = /^\d+ (.*)$/.exec(copyright)?.[1] ?? '';
			const pkgId = /** @type {string} */ (patches[path]);
			const match = /^(?<name>.+?)@(?<version>.+)$/.exec(pkgId);

			if (!match) {
				throw new Error(`String “${pkgId}” is not a Package Id.`);
			}

			const {name, version} =
				/** @type {{name: string; version: string}} */ (match.groups);

			return {
				path,
				name,
				version,
				originalAuthors: originalAuthors.split(/,? and |, /g),
				patchAuthors: patchBy.split(/,? and |, /g),
				license,
			};
		},
	);

	await fs.writeFile(paths.patchesIndexFile, JSON.stringify(index) + '\n');
	await fs.writeFile(paths.patchesIntegrityFile, integrity + '\n');
	console.log('Done fetching the patch licenses.');
}
