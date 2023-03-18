/* eslint-disable import/no-unassigned-import */
import 'vite/client';
import 'vitest/importMeta';

declare global {
	// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
	interface ImportMetaEnv {
		RTE_TREE_URL: string;
		RTE_BLOB_URL: string;
	}
}
