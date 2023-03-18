export const rootDir = new URL('../', import.meta.url);
export const rootLicenseFile = new URL('LICENSE.md', rootDir);
export const pnpmLockFile = new URL('pnpm-lock.yaml', rootDir);
export const packageFile = new URL('package.json', rootDir);
export const licensesDir = new URL('LICENSES/', rootDir);

export const outDir = new URL('build/licenses/', rootDir);
export const licenseFilesDir = new URL('files/', outDir);
export const outReuseDir = new URL('.reuse/', outDir);
export const outLicenseFile = new URL('LICENSE.md', outDir);

export const rootReuseDir = new URL('.reuse/', rootDir);
export const dep5File = new URL('dep5', rootReuseDir);

export const depsDir = new URL('deps/', outDir);
export const depsIntegrityFile = new URL('.integrity', depsDir);
export const depsIndexFile = new URL('index.json', depsDir);

export const patchesDir = new URL('patches/', outDir);
export const patchesIntegrityFile = new URL('.integrity', patchesDir);
export const patchesIndexFile = new URL('index.json', patchesDir);
