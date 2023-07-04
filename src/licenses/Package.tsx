import type {FunctionComponent} from 'preact';
import type * as Types from '../license-types.js';
import {useCompLayer} from '../composition/layer.js';
import {LegacyLicense} from './LegacyLicense.js';
import * as css from './Project.module.css';
import {Project} from './Project.js';
import {licenseFile} from './LicenseFile.js';

export const Package: FunctionComponent<{
	pkg: Types.Package;
}> = ({pkg}) => {
	const layer = useCompLayer();
	const pkgId = `${pkg.name}@${pkg.version}`;
	let hasLicenseFile = false;
	let license;

	switch (pkg.license.type) {
		case 'spdx': {
			hasLicenseFile = !pkg.license.fileMissing;
			license = (
				<p>
					<code>{pkg.license.id}</code>.
					{pkg.license.fileMissing && ' License file not found!'}
				</p>
			);

			break;
		}

		case 'custom': {
			hasLicenseFile = true;
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
			registry={`https://www.npmjs.com/package/${pkg.name}/v/${pkg.version}`}
			repository={pkg.repository}
			license={
				hasLicenseFile
					? licenseFile.afterOnClick(layer, {
							path: pkgId,
							label: pkgId,
							dir: 'licenses/deps/',
							'is-package': true,
					  })
					: undefined
			}
		>
			{license}
		</Project>
	);
};
