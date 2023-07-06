import {createHash} from 'node:crypto';
import {mkdir, readFile, rm} from 'node:fs/promises';
import type {BinaryLike} from 'node:crypto';
import type {Plugin} from 'vite';

export const definePlugin = (plugin: Plugin) => plugin;

export function getIntegrity(content: BinaryLike) {
	return 'sha256-' + createHash('sha256').update(content).digest('base64');
}

export async function isBuildUpToDate(integrityFile: URL, integrity: string) {
	try {
		const buildIntegrity = await readFile(integrityFile, 'utf8');

		return integrity.trim() === buildIntegrity.trim();
	} catch {
		return false;
	}
}

export async function createDir(dir: URL) {
	await mkdir(dir, {recursive: true});
}

export async function destroyDir(dir: URL) {
	await rm(dir, {force: true, recursive: true});
}
