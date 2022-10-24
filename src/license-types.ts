export type Package = {
	readonly name: string;
	readonly version: string;
	readonly authors: readonly string[];
	readonly license: License;
};

export type License =
	| SpdxLicense
	| CustomLicense
	| LegacyLicense
	| UnknownLicense;

export type SpdxLicense = {
	readonly type: 'spdx';
	readonly id: string;
	readonly hasFile: boolean;
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
