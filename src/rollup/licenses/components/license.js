import fs from 'node:fs';
import path from 'node:path';
import {h, Fragment} from 'preact';
import LoadableDetails from './loadable-details.js';

/** @type {import('preact').FunctionComponent<{license: LicenseInfo}>} */
const LicenseInfo = props => {
	if (Array.isArray(props.license)) {
		return h(LegacyLicenses, {licenses: props.license});
	}

	if (props.license === undefined) {
		return h(NoLicense, null);
	}

	if (props.license.type === 'custom') {
		return h(CustomLicense, {license: props.license});
	}

	return h(SPDXLicense, {license: props.license});
};

/** @type {import('preact').FunctionComponent<{license: SPDXLicense}>} */
const SPDXLicense = props =>
	props.license.path
		? h(
			LoadableDetails,
			{url: props.license.path},
			h('code', null, props.license.id || '[unknown license]'),
		)
		: h(
			'p',
			null,
			h('code', null, props.license.id || '[unknown license]'),
			'. License file not found.',
		);

/** @type {import('preact').FunctionComponent<{license: CustomLicense}>} */
const CustomLicense = props =>
	h(LoadableDetails, {url: props.license.path}, 'custom license');

/** @type {import('preact').FunctionComponent<{licenses: LegacyLicense[]}>} */
const LegacyLicenses = props =>
	h(
		Fragment,
		null,
		h(
			'p',
			null,
			'This version uses legacy object ',
			h('code', null, 'license'),
			'/',
			h('code', null, 'licenses'),
			' field.',
		),
		h(
			'ul',
			null,
			props.licenses.map(license =>
				h(
					'li',
					null,
					h(
						'a',
						{href: license.url},
						h('code', null, license.type || '[unknown license]'),
					),
				),
			),
		),
	);

/** @type {import('preact').FunctionComponent} */
const NoLicense = () => h('p', null, 'License not found!');

/**
 * @typedef {Object} LicenseOptions
 * @prop {string} name
 * @prop {string} version
 * @prop {boolean} [dev]
 * @prop {Set<string>} authors
 * @prop {LicenseInfo} license
 *
 * @typedef {SPDXLicense | CustomLicense | LegacyLicense[] | NoLicense} LicenseInfo
 *
 * @typedef {Object} SPDXLicense
 * @prop {'spdx'} type
 * @prop {string} id
 * @prop {string} [path]
 *
 * @typedef {Object} CustomLicense
 * @prop {'custom'} type
 * @prop {string} path
 *
 * @typedef {Object} LegacyLicense
 * @prop {string} type
 * @prop {string} url
 *
 * @typedef {undefined} NoLicense
 */
/** @type {import('preact').FunctionComponent<LicenseOptions>} */
const License = props =>
	h(
		Fragment,
		null,
		h(
			'h3',
			null,
			h(
				'a',
				{
					href: `https://www.npmjs.com/package/${props.name}/v/${props.version}`,
				},
				h(
					'code',
					{'aria-label': `${props.name}@${props.version}`},
					props.version,
				),
			),
			props.dev === undefined || [
				' ',
				h('span', {class: 'tag'}, props.dev ? 'dev' : 'prod'),
			],
		),
		h('p', null, ...getAttributions(props.authors)),
		h(LicenseInfo, {license: props.license}),
	);

export default License;

/**
 * @param {unknown} pkgLicense
 * @param {unknown} pkgLicenses
 * @param {string} pkgDir
 * @param {string} pkgId
 * @returns {{license: LicenseInfo, licensePath: string | undefined}}
 */
export function getLicenseInfo(pkgLicense, pkgLicenses, pkgDir, pkgId) {
	if (typeof pkgLicense !== 'string') {
		const licenses = /** @type {LegacyLicense[]} */ (
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
				license: licenseFile ? {type: 'custom', path: pkgId} : undefined,
				licensePath: licenseFile,
			};
		}

		return {license: licenses, licensePath: undefined};
	}

	const match = /^SEE LICENSE IN (.+)$/.exec(pkgLicense);

	if (match?.[1]) {
		return {
			license: {type: 'custom', path: pkgId},
			licensePath: path.join(pkgDir, match[1]),
		};
	}

	const licenseFile = tryFindLicenseFile(pkgDir);

	return {
		license: {
			type: 'spdx',
			id: pkgLicense,
			path: licenseFile ? pkgId : undefined,
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
		if (fs.existsSync(path.join(pkgDir, file))) {
			return path.join(pkgDir, file);
		}
	}

	return undefined;
}

/**
 * @param {Set<string>} authors
 * @returns {Generator<import('preact').ComponentChild>}
 */
function * getAttributions(authors) {
	yield 'By ';

	if (authors.size === 0) {
		yield 'unknown authors.';
		return;
	}

	if (authors.size <= 2) {
		yield * iterate(authors, ' and ');
		yield '.';
		return;
	}

	const authorsList = [...authors];
	yield * iterate(authorsList.slice(0, -1), ', ');
	yield ', and ';
	yield format(/** @type {string} */ (authorsList.at(-1)));
	yield '.';

	/** @param {string} item */
	function format(item) {
		return h('i', null, item);
	}

	/**
	 * @param {Iterable<string>} array
	 * @param {string} separator
	 */
	function * iterate(array, separator) {
		let isFirst = true;

		for (const item of array) {
			if (isFirst) {
				isFirst = false;
			} else {
				yield separator;
			}

			yield format(item);
		}
	}
}
