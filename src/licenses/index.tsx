import type {FunctionComponent} from 'preact';
import {Suspense} from 'preact/compat';
import {AllowScroll} from '../AllowScroll.js';
import {Loading} from '../Loading.js';
import {CloseButton} from '../composition/CloseButton.js';
import {NavColumn} from '../navigation/NavColumn.js';
import {CompPageBuilder} from '../composition/page.js';
import {NavRoot} from '../navigation/NavRoot.js';
import {Project} from './Project.js';
import {Dependencies} from './packages-list.js';
import {Patches} from './patches-list.js';

export const Licenses: FunctionComponent = () => (
	<>
		<AllowScroll />
		<NavColumn>
			<header>
				<nav>
					<CloseButton />
				</nav>
			</header>
			<main>
				<NavColumn>
					<h1>Licenses</h1>
					<h2>This project</h2>
					<Project
						name="RTE"
						heading="RTE"
						authors={['esdmr']}
						source={import.meta.env.RTE_TREE_URL}
						license={
							new URL('LICENSE.md', import.meta.env.RTE_BLOB_URL)
								.href
						}
					>
						<p>
							Multiple licenses. Mostly <code>AGPL-3.0-only</code>
							.
						</p>
					</Project>
					<h2>Patches</h2>
					<Suspense fallback={<Loading placement="center" />}>
						<Patches />
					</Suspense>
					<h2>Dependencies</h2>
					<Project
						name="Material Design Icons"
						heading="Material Design Icons"
						authors={['Google']}
						repository="https://github.com/google/material-design-icons"
						license="https://github.com/google/material-design-icons/blob/master/LICENSE"
					>
						<p>
							<code>Apache-2.0</code>.
						</p>
						<p>
							Used indirectly via <code>@mdi/js</code>.
						</p>
					</Project>
					<Suspense fallback={<Loading placement="center" />}>
						<Dependencies />
					</Suspense>
					<h2>Development Dependencies</h2>
					<p>
						There are many of them! So much that it would lag the
						browser if loaded. You can run{' '}
						<code>pnpm ls --dev --depth Infinity</code> on a local
						instance to display them instead.
					</p>
				</NavColumn>
			</main>
		</NavColumn>
	</>
);

export const licenses = new CompPageBuilder(
	() => (
		<NavRoot>
			<Licenses />
		</NavRoot>
	),
	{},
);
