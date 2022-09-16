import type {FunctionComponent} from 'preact';
import {Route} from 'wouter-preact';
import {DebugGallery} from './DebugGallery.js';
import {DebugRoute} from './DebugRoute.js';
import {EditorContainer} from './EditorContainer.js';
import {HomePage} from './HomePage.js';
import {Licenses} from './licenses/index.js';
import {LicenseFile} from './licenses/LicenseFile.js';
import {DebugNav} from './navigation/DebugNav.js';
import {NavSwitch} from './navigation/NavSwitch.js';
import {DebugPageState} from './page-state/DebugPageState.js';
import {UnknownRoute} from './UnknownRoute.js';

export const App: FunctionComponent = () => (
	<NavSwitch>
		<Route path="/">{() => <HomePage />}</Route>
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
		<Route path="/debug/route/:id+">{({id}) => <DebugRoute id={id} />}</Route>
		<Route path="/debug/nav">{() => <DebugNav />}</Route>
		<Route path="/debug/page-state">{() => <DebugPageState />}</Route>
		<Route>{() => <UnknownRoute />}</Route>
	</NavSwitch>
);
