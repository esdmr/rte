import type {FunctionComponent} from 'preact';
import {Route} from 'wouter-preact';
import {DebugGallery} from './DebugGallery.js';
import {DebugRoute} from './DebugRoute.js';
import {EditorContainer} from './EditorContainer.js';
import {DebugGamepad} from './gamepad/DebugGamepad.js';
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
		<Route path="/debug/licenses/patches/:id/:pkg*">
			{({id, pkg}) => (
				<LicenseFile
					path={id + '.txt'}
					label={(pkg ?? 'an unknown') + ' patch'}
					dir="licenses/files/"
					return-route="/debug/licenses"
				/>
			)}
		</Route>
		<Route path="/debug/licenses/deps/:pkg+">
			{({pkg}) => (
				<LicenseFile
					path={pkg}
					label={pkg}
					dir="licenses/deps/"
					is-package
					return-route="/debug/licenses"
				/>
			)}
		</Route>
		<Route path="/debug/licenses">
			{() => <Licenses return-route="/" />}
		</Route>
		<Route path="/debug/editor">{() => <EditorContainer />}</Route>
		<Route path="/debug/gallery">{() => <DebugGallery />}</Route>
		<Route path="/debug/route/:id+">
			{({id}) => <DebugRoute id={id} />}
		</Route>
		<Route path="/debug/nav">{() => <DebugNav />}</Route>
		<Route path="/debug/page-state">{() => <DebugPageState />}</Route>
		<Route path="/debug/gamepad">{() => <DebugGamepad />}</Route>
		<Route>{() => <UnknownRoute />}</Route>
	</NavSwitch>
);
