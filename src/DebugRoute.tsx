import {mdiHome} from '@mdi/js';
import {Icon} from '@mdi/react';
import type {FunctionComponent} from 'preact';
import {AllowScroll} from './AllowScroll.js';
import {CircularButton} from './CircularButton.js';
import {Link} from './Link.js';
import {NavColumn} from './navigation/NavColumn.js';

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
				<h1>Debug route: {id}</h1>
				<nav aria-label="Debug route links">
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
