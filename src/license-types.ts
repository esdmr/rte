export type Package = {
	name: string;
	version: string;
	dev?: boolean | undefined;
	authors: string[];
	license: License;
};

export type License = SpdxLicense | CustomLicense | LegacyLicense[] | undefined;

export type SpdxLicense = {
	type: 'spdx';
	id: string;
	hasFile: boolean;
};

export type CustomLicense = {
	type: 'custom';
};

export type LegacyLicense = {
	type: string;
	url: string;
};
