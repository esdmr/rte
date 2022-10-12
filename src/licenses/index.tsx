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

					<h2>Dependencies</h2>
					<Suspense fallback={<Loading placement="center" />}>
						<Dependencies />
					</Suspense>
				</NavColumn>
			</main>
		</NavColumn>
	</>
);
