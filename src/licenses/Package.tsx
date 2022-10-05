import type {FunctionComponent} from 'preact';
import {Icon} from '@mdi/react';
import {mdiChevronRight} from '@mdi/js';
import type * as Types from '../license-types.js';
import {classes} from '../classes.js';
import {CircularButton} from '../circular-button.js';
import * as css from './Package.module.css.js';
import {LegacyLicense} from './LegacyLicense.js';

const getLicenseFileUrl = (route: string, pkgId: string) => {
	const encodedPkgId = encodeURIComponent(pkgId)
		.replace(/%40/g, '@')
		.replace(/%2F/g, '/');

	return `${route}${encodedPkgId}`;
};

const listFormat = new Intl.ListFormat('en', {style: 'long'});

const getAttributions = (authors: string[]) => {
	if (authors.length === 0) {
		return ['unknown authors'];
	}

	return listFormat
		.formatToParts(authors)
		.map((item) =>
			item.type === 'element' ? <i>{item.value}</i> : item.value,
		);
};

export const Package: FunctionComponent<{
	pkg: Types.Package;
	route: string;
}> = ({pkg, route}) => {
	const pkgId = `${pkg.name}@${pkg.version}`;
	let licenseFile = false;
	let license;

	if (Array.isArray(pkg.license)) {
		license = <LegacyLicense licenses={pkg.license} />;
	} else if (pkg.license === undefined) {
		license = <p>License not found!</p>;
	} else if (pkg.license.type === 'custom') {
		licenseFile = true;
		license = <p>Custom license.</p>;
	} else {
		licenseFile = pkg.license.hasFile;
		license = (
			<p>
				<code>{pkg.license.id}</code>.
				{pkg.license.hasFile || ' License file not found!'}
			</p>
		);
	}

	return (
		<div class={classes(css.pkg, licenseFile ? css.hasLicenseFile : undefined)}>
			<div class={css.content}>
				<h2 class={css.heading}>
					<code>{pkg.name}</code> <code class={css.version}>{pkg.version}</code>
				</h2>
				<p>By {getAttributions(pkg.authors)}.</p>
				{license}
			</div>
			{licenseFile && (
				<div class={css.icon}>
					<CircularButton
						href={getLicenseFileUrl(route, pkgId)}
						title="See license file"
					>
						<Icon path={mdiChevronRight} />
					</CircularButton>
				</div>
			)}
		</div>
	);
};
