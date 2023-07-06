import {spawnSync} from 'node:child_process';
import {readFileSync, createWriteStream} from 'node:fs';
import {rootLicenseFile} from './paths.js';

const {stdout, status} = spawnSync('reuse', ['spdx']);

if (status) {
	throw new Error(`REUSE cli failed with status code: ${status}`);
}

const dep5 = stdout.toString('utf8');

const rulesArray: ReadonlyArray<Record<string, string>> = dep5
	.trim()
	.replace(/<text>(.*?)<\/text>/gs, (_, match: string) =>
		match.replaceAll('\n', '\v'),
	)
	.split('\n\n')
	.slice(1)
	.map(
		(i) =>
			Object.fromEntries(
				i
					.split(/\n(?!\t)/g)
					.map((i) => i.replace(/\s+/g, ' ').split(': '))
					.filter((i) => i.length === 2),
			) as Record<string, string>,
	);

class File {
	constructor(readonly license: string, readonly copy: string) {}
}

const files = new Map<string, File>();

for (const rule of rulesArray) {
	if (!('FileName' in rule)) continue;
	if (!('LicenseInfoInFile' in rule && 'FileCopyrightText' in rule)) {
		throw new Error(`file ${rule.FileName} does not have required fields`);
	}

	files.set(
		rule.FileName.replace(/^\.\//, ''),
		new File(rule.LicenseInfoInFile, rule.FileCopyrightText),
	);
}

type Directory = {[x: string]: Directory | File};

const root = Object.create(null) as Directory;

for (const [name, file] of files) {
	const parts = name.split('/');
	const basename = parts.pop()!;
	let dir = root;

	for (const part of parts) {
		dir[part] ??= Object.create(null) as Directory;

		if (dir[part] instanceof File) {
			throw new TypeError('Expected file to be a directory');
		}

		dir = dir[part] as Directory;
	}

	dir[basename] = file;
}

function* iterateOverDirectory(dir: Directory) {
	const keys = Object.keys(dir).sort((a, b) => a.localeCompare(b, 'en-US'));
	const lastKey = keys.at(-1);

	for (const key of keys) {
		yield {
			key,
			value: dir[key]!,
			isLast: key === lastKey,
		};
	}
}

function* printFile(file: File) {
	// REUSE-IgnoreStart
	yield* `  ${file.license} © ${file.copy}`.split('\n');
	// REUSE-IgnoreEnd
}

function* printDirectory(dir: Directory) {
	for (const {key, value, isLast} of iterateOverDirectory(dir)) {
		yield isLast ? `└╴ ${key}` : `├╴ ${key}`;

		for (const line of printNode(value)) {
			yield isLast ? `   ${line}` : `│  ${line}`;
		}
	}
}

function printNode(node: File | Directory): Generator<string> {
	return node instanceof File ? printFile(node) : printDirectory(node);
}

const content = readFileSync(rootLicenseFile, 'utf8');
const file = createWriteStream(rootLicenseFile, 'utf8');
const tagBegin = '<!-- BEGIN-REUSE-OUTPUT -->';
const tagEnd = '<!-- END-REUSE-OUTPUT -->';
const beginIndex = content.indexOf(tagBegin);
const endIndex = content.indexOf(tagEnd);

if (beginIndex < 0 || endIndex < 0) {
	throw new Error('License file does not have the output tags');
}

file.write(content.slice(0, beginIndex + tagBegin.length));
file.write('\n');

for (const line of printDirectory(root)) {
	file.write('    ');
	file.write(line);
	file.write('\n');
}

file.write(content.slice(endIndex));
