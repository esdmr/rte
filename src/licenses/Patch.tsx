import type {FunctionComponent} from 'preact';
import type * as Types from '../license-types.js';
import * as css from './Project.module.css';
import {encodePkgId, Project} from './Project.js';
import {Authors} from './Authors.js';

export const Patch: FunctionComponent<{
	patch: Types.Patch;
	route: string;
}> = ({patch, route}) => {
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
			source={{
				href: new URL(patch.path, import.meta.env.RTE_TREE_URL).href,
				external: true,
			}}
			license={{
				href: `${route}patches/${patch.license}/${encodePkgId(pkgId)}`,
			}}
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
