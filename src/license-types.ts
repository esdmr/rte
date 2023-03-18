export type Package = {
	readonly name: string;
	readonly version: string;
	readonly authors: readonly string[];
	readonly license: License;
	readonly repository: string;
};

export type License =
	| SpdxLicense
	| CustomLicense
	| LegacyLicense
	| UnknownLicense;

export type SpdxLicense = {
	readonly type: 'spdx';
	readonly id: string;
	readonly fileMissing?: true;
};

export type CustomLicense = {
	readonly type: 'custom';
};

export type LegacyLicense = {
	readonly type: 'legacy';
	readonly entries: ReadonlyArray<{
		readonly type: string;
		readonly url: string;
	}>;
};

export type UnknownLicense = {
	readonly type: 'unknown';
};

export type Patch = {
	readonly name: string;
	readonly version: string;
	readonly path: string;
	readonly originalAuthors: readonly string[];
	readonly patchAuthors: readonly string[];
	readonly license: string;
};
