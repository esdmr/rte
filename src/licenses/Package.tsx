import type {FunctionComponent} from 'preact';
import type * as Types from '../license-types.js';
import {LegacyLicense} from './LegacyLicense.js';
import * as css from './Project.module.css.js';
import {encodePkgId, Project} from './Project.js';

export const Package: FunctionComponent<{
	pkg: Types.Package;
	route: string;
}> = ({pkg, route}) => {
	const pkgId = `${pkg.name}@${pkg.version}`;
	let licenseFile = false;
	let license;

	switch (pkg.license.type) {
		case 'spdx': {
			licenseFile = !pkg.license.fileMissing;
			license = (
				<p>
					<code>{pkg.license.id}</code>.
					{pkg.license.fileMissing && ' License file not found!'}
				</p>
			);

			break;
		}

		case 'custom': {
			licenseFile = true;
			license = <p>Custom license.</p>;
			break;
		}

		case 'legacy': {
			license = <LegacyLicense license={pkg.license} />;
			break;
		}

		default: {
			license = <p>License not found!</p>;
		}
	}

	return (
		<Project
			name={pkgId}
			heading={
				<>
					<code>{pkg.name}</code>{' '}
					<code class={css.version}>{pkg.version}</code>
				</>
			}
			authors={pkg.authors}
			npm={{
				href: `https://www.npmjs.com/package/${pkg.name}/v/${pkg.version}`,
				external: true,
			}}
			license={
				licenseFile
					? {
							href: `${route}deps/${encodePkgId(pkgId)}`,
					  }
					: undefined
			}
		>
			{license}
		</Project>
	);
};
