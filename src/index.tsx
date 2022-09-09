// eslint-disable-next-line import/no-unassigned-import
import 'preact/debug';
import {render} from 'preact';
import {Router} from 'wouter-preact';
import {App} from './components/app.js';
import {NavRoot} from './components/navigation/root.js';
import './index.css';
import {useHashLocation} from './wouter-hash.js';

render(
	<NavRoot>
		<Router hook={useHashLocation}>
			<App />
		</Router>
	</NavRoot>,
	document.body,
);
