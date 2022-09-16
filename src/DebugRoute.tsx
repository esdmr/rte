import {mdiHome} from '@mdi/js';
import {Icon} from '@mdi/react';
import type {FunctionComponent} from 'preact';
import {Link} from './Link.js';
import {AllowScroll} from './AllowScroll.js';
import {CircularButton} from './circular-button.js';
import {NavColumn} from './navigation/NavColumn.js';
import {Title} from './Title.js';

export const DebugRoute: FunctionComponent<{id: string}> = ({id}) => (
	<>
		<AllowScroll />
		<NavColumn>
			<header>
				<nav>
					<CircularButton href="/" title="Home">
						<Icon path={mdiHome} />
					</CircularButton>
				</nav>
			</header>
			<main>
				<Title h1>Debug route: {id}</Title>
				<nav>
					<ul>
						<NavColumn>
							<li>
								<Link href="/debug/route/a">link to: a</Link>
							</li>
							<li>
								<Link href="/debug/route/b">link to: b</Link>
							</li>
						</NavColumn>
					</ul>
				</nav>
			</main>
		</NavColumn>
	</>
);
