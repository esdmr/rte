import {mdiArrowLeft} from '@mdi/js';
import {Icon} from '@mdi/react';
import type {FunctionComponent} from 'preact';
import {Suspense} from 'preact/compat';
import {AllowScroll} from '../AllowScroll.js';
import {CircularButton} from '../circular-button.js';
import {Loading} from '../Loading.js';
import {NavColumn} from '../navigation/NavColumn.js';
import {Title} from '../Title.js';
import {Dependencies} from './packages-list.js';
import {Patches} from './patches-list.js';
import {Project} from './Project.js';

export const Licenses: FunctionComponent<{
	'return-route': string;
}> = (props) => (
	<>
		<AllowScroll />
		<NavColumn>
			<header>
				<nav>
					<CircularButton href={props['return-route']} title="Back">
						<Icon path={mdiArrowLeft} />
					</CircularButton>
				</nav>
			</header>
			<main>
				<NavColumn>
					<Title h1>Licenses</Title>
					<h2>This project</h2>
					<Project
						name="RTE"
						heading="RTE"
						authors={['esdmr']}
						source={{
							href: import.meta.env.RTE_TREE_URL,
							external: true,
						}}
						license={{
							href: new URL(
								'LICENSE.md',
								import.meta.env.RTE_BLOB_URL,
							).href,
							external: true,
						}}
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
						repository={{
							href: 'https://github.com/google/material-design-icons',
							external: true,
						}}
						license={{
							href: 'https://github.com/google/material-design-icons/blob/master/LICENSE',
							external: true,
						}}
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
