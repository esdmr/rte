import type {FunctionComponent} from 'preact';
import type * as Types from '../license-types.js';
import * as css from './Project.module.css';
import {Project} from './Project.js';
import {Authors} from './Authors.js';
import {licenseFile} from './LicenseFile.js';

export const Patch: FunctionComponent<{
	patch: Types.Patch;
}> = ({patch}) => {
	const pkgId = `${patch.name}@${patch.version}`;

	return (
		<Project
			name={pkgId + ' patch'}
			heading={
				<>
					<code>{patch.name}</code>{' '}
					<code class={css.version}>{patch.version}</code> Patch
				</>
			}
			source={new URL(patch.path, import.meta.env.RTE_TREE_URL).href}
			license={[
				licenseFile,
				{
					path: patch.license + '.txt',
					label: (pkgId ?? 'an unknown') + ' patch',
					dir: 'licenses/files/',
				},
			]}
		>
			<p>
				Original package by <Authors list={patch.originalAuthors} />.
			</p>
			<p>
				Patch by <Authors list={patch.patchAuthors} />.
			</p>
			<p>
				<code>{patch.license}</code>.
			</p>
		</Project>
	);
};
