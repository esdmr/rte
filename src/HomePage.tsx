import type {FunctionComponent} from 'preact';
import {Link} from './Link.js';
import {AllowScroll} from './AllowScroll.js';
import {NavColumn} from './navigation/NavColumn.js';

export const HomePage: FunctionComponent = () => (
	<>
		<header aria-hidden />
		<main>
			<AllowScroll />
			<h1>RTE</h1>
			<p>Work in progress!</p>
			<nav>
				<ul>
					<NavColumn>
						<li>
							<Link href="/debug/editor">Debug Editor</Link>
						</li>
						<li>
							<Link href="/debug/licenses">Debug Licenses</Link>
						</li>
						<li>
							<Link href="/debug/gallery">Debug Gallery</Link>
						</li>
						<li>
							<Link href="/debug/route/init">Debug routes</Link>
						</li>
						<li>
							<Link href="/debug/nav">Debug navigation</Link>
						</li>
						<li>
							<Link href="/debug/page-state">
								Debug page state
							</Link>
						</li>
						<li>
							<Link href="/debug/gamepad">Debug gamepad</Link>
						</li>
					</NavColumn>
				</ul>
			</nav>
		</main>
	</>
);
