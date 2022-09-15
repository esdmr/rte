import {mdiHome} from '@mdi/js';
import {Icon} from '@mdi/react';
import type {FunctionComponent} from 'preact';
import {Route} from 'wouter-preact';
import {AllowScroll} from './AllowScroll.js';
import {CircularButton} from './circular-button.js';
import {DebugGallery} from './DebugGallery.js';
import {EditorContainer} from './EditorContainer.js';
import {LicenseFile} from './licenses/LicenseFile.js';
import {Licenses} from './licenses/index.js';
import {Link} from './Link.js';
import {NavColumn} from './navigation/NavColumn.js';
import {DebugNav} from './navigation/DebugNav.js';
import {NavSwitch} from './navigation/NavSwitch.js';
import {Title} from './Title.js';
import {DebugPageState} from './page-state/DebugPageState.js';

export const App: FunctionComponent = () => (
	<NavSwitch>
		<Route path="/">
			{() => (
				<>
					<header />
					<main>
						<AllowScroll />
						<h1>Gamepad Editor</h1>
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
										<Link href="/debug/page-state">Debug page state</Link>
									</li>
								</NavColumn>
							</ul>
						</nav>
					</main>
				</>
			)}
		</Route>
		<Route path="/debug/licenses/dev/:id+">
			{({id}) => <LicenseFile id={id} return-route="/debug/licenses/dev" />}
		</Route>
		<Route path="/debug/licenses/dev">
			{() => <Licenses dev return-route="/debug/licenses" />}
		</Route>
		<Route path="/debug/licenses/:id+">
			{({id}) => <LicenseFile id={id} return-route="/debug/licenses" />}
		</Route>
		<Route path="/debug/licenses">{() => <Licenses return-route="/" />}</Route>
		<Route path="/debug/editor">{() => <EditorContainer />}</Route>
		<Route path="/debug/gallery">{() => <DebugGallery />}</Route>
		<Route path="/debug/route/:id+">
			{({id}) => (
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
			)}
		</Route>
		<Route path="/debug/nav">{() => <DebugNav />}</Route>
		<Route path="/debug/page-state">{() => <DebugPageState />}</Route>
		<Route>
			{() => (
				<>
					<AllowScroll />
					<header>
						<nav>
							<CircularButton href="/" title="Home">
								<Icon path={mdiHome} />
							</CircularButton>
						</nav>
					</header>
					<main>
						<Title h1>Page not found!</Title>
					</main>
				</>
			)}
		</Route>
	</NavSwitch>
);
