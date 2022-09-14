import {mdiArrowLeft} from '@mdi/js';
import {Icon} from '@mdi/react';
import type {FunctionComponent} from 'preact';
import {Suspense} from 'preact/compat';
import {AllowScroll} from '../AllowScroll.js';
import {CircularButton} from '../circular-button.js';
import {Loading} from '../Loading.js';
import {Title} from '../Title.js';
import {Link} from '../Link.js';
import {NavColumn} from '../navigation/NavColumn.js';
import {Development, Production} from './packages-list.js';

export const Licenses: FunctionComponent<{
	dev?: boolean;
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

					<h2>{props.dev ? 'Development dependencies' : 'Dependencies'}</h2>
					<Suspense fallback={<Loading placement="center" />}>
						{props.dev ? <Development /> : <Production />}
					</Suspense>

					{!props.dev && (
						<>
							<h2>Development dependencies</h2>
							<Link href="/debug/licenses/dev">
								See development dependencies.
							</Link>
						</>
					)}
				</NavColumn>
			</main>
		</NavColumn>
	</>
);
