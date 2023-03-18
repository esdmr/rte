import {createHash} from 'node:crypto';
import {mkdir, readFile, rm} from 'node:fs/promises';

/** @param {import('vite').Plugin} plugin */
export const definePlugin = (plugin) => plugin;

/**
 * @param {import('node:crypto').BinaryLike} content
 */
export function getIntegrity(content) {
	return 'sha256-' + createHash('sha256').update(content).digest('base64');
}

/**
 * @param {URL} integrityFile
 * @param {string} integrity
 */
export async function isBuildUpToDate(integrityFile, integrity) {
	try {
		const buildIntegrity = await readFile(integrityFile, 'utf8');

		return integrity.trim() === buildIntegrity.trim();
	} catch {
		return false;
	}
}

/**
 * @param {URL} dir
 */
export async function createDir(dir) {
	await mkdir(dir, {recursive: true});
}

/**
 * @param {URL} dir
 */
export async function destroyDir(dir) {
	await rm(dir, {force: true, recursive: true});
}
