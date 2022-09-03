import {mdiArrowLeft} from '@mdi/js';
import {Icon} from '@mdi/react';
import type {FunctionComponent} from 'preact';
import {Suspense} from 'preact/compat';
import {AllowScroll} from '../allow-scroll.js';
import {CircularButton} from '../circular-button.js';
import {Loading} from '../loading.js';
import {Title} from '../title.js';
import {Link} from '../link.js';
import {Development, Production} from './packages-list.js';

export const Licenses: FunctionComponent<{
	dev?: boolean;
	'return-route': string;
}> = props => <>
	<AllowScroll />
	<header>
		<nav>
			<CircularButton href={props['return-route']}>
				<Icon path={mdiArrowLeft} title='Back' />
			</CircularButton>
		</nav>
	</header>
	<main>
		<Title h1>Licenses</Title>

		<h2>{props.dev ? 'Development dependencies' : 'Dependencies'}</h2>
		<Suspense fallback={<Loading placement='center' />}>
			{props.dev ? <Development /> : <Production />}
		</Suspense>

		{!props.dev && <>
			<h2>Development dependencies</h2>
			<Link href='/debug/licenses/dev'>See development dependencies.</Link>
		</>}
	</main>
</>;
