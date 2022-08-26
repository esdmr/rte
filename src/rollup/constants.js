import path from 'node:path';
import process from 'node:process';
import {fileURLToPath} from 'node:url';

export const isProduction = process.env.NODE_ENV === 'production';
export const buildDir = 'build';
export const publicPath = '/';

const cwd = process.cwd();
const dirname = fileURLToPath(new URL('.', import.meta.url));
const root = path.join(dirname, '..', '..');

if (path.join(cwd, buildDir) !== path.join(root, buildDir)) {
	throw new Error(`Incorrect working directory: ${cwd}. Expected: ${root}`);
}
