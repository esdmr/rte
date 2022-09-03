export interface Package {
	name: string;
	version: string;
	dev?: boolean | undefined;
	authors: string[];
	license: License;
}

export type License = SpdxLicense | CustomLicense | LegacyLicense[] | undefined;

export interface SpdxLicense {
	type: 'spdx';
	id: string;
	hasFile: boolean;
}

export interface CustomLicense {
	type: 'custom';
}

export interface LegacyLicense {
	type: string;
	url: string;
}
