import {mdiHome} from '@mdi/js';
import {Icon} from '@mdi/react';
import type {FunctionComponent} from 'preact';
import {Route, Router, Switch} from 'wouter-preact';
import {useHashLocation} from '../wouter-hash.js';
import {AllowScroll} from './allow-scroll.js';
import {CircularButton} from './circular-button.js';
import {DebugGallery} from './debug-gallery.js';
import {EditorContainer} from './editor-container.js';
import {Link} from './link.js';
import {Title} from './title.js';

export const App: FunctionComponent = () => <Router hook={useHashLocation}>
	<Switch>
		<Route path='/'>
			{() => <main>
				<AllowScroll />
				<h1>Gamepad Editor</h1>
				<p>Work in progress!</p>
				<nav>
					<ul>
						<li><Link href='/debug/editor'>Debug Editor</Link></li>
						<li><Link href='/debug/gallery'>Debug Gallery</Link></li>
						<li><Link href='/debug/route/init'>Debug routes</Link></li>
					</ul>
				</nav>
			</main>}
		</Route>
		<Route path='/debug/editor'>{() => <EditorContainer />}</Route>
		<Route path='/debug/gallery'>{() => <DebugGallery />}</Route>
		<Route path='/debug/route/:id'>
			{({id}) => <>
				<AllowScroll />
				<header>
					<nav>
						<CircularButton href='/'>
							<Icon path={mdiHome} title='Home' />
						</CircularButton>
					</nav>
				</header>
				<main>
					<Title h1>Debug route: {id}</Title>
					<nav>
						<ul>
							<li><Link href='/debug/route/a'>link to: a</Link></li>
							<li><Link href='/debug/route/b'>link to: b</Link></li>
						</ul>
					</nav>
				</main>
			</>}
		</Route>
		<Route>
			{() => <>
				<header>
					<nav>
						<CircularButton href='/'>
							<Icon path={mdiHome} title='Home' />
						</CircularButton>
					</nav>
				</header>
				<main>
					<Title h1>Page not found!</Title>
				</main>
			</>}
		</Route>
	</Switch>
</Router>;
