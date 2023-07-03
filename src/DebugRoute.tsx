import type {FunctionComponent} from 'preact';
import {AllowScroll} from './AllowScroll.js';
import {Link} from './Link.js';
import {CloseButton} from './composition/CloseButton.js';
import {CompPageBuilder} from './composition/page.js';
import {NavColumn} from './navigation/NavColumn.js';
import {NavRoot} from './navigation/NavRoot.js';

export const DebugRoute: FunctionComponent<{id: string}> = ({id}) => (
	<NavRoot>
		<AllowScroll />
		<NavColumn>
			<header>
				<nav>
					<CloseButton />
				</nav>
			</header>
			<main>
				<h1>Debug route: {id}</h1>
				<nav aria-label="Debug route links">
					<ul>
						<NavColumn>
							<li>
								<Link
									builder={debugRoute}
									newParameters={{id: 'a'}}
									replace
								>
									link to: a
								</Link>
							</li>
							<li>
								<Link
									builder={debugRoute}
									newParameters={{id: 'b'}}
									replace
								>
									link to: b
								</Link>
							</li>
						</NavColumn>
					</ul>
				</nav>
			</main>
		</NavColumn>
	</NavRoot>
);

export const debugRoute = new CompPageBuilder(DebugRoute, {id: 'init'});
