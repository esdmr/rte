// eslint-disable-next-line import/no-unassigned-import
import 'preact/debug';
import {render} from 'preact';
import {Router} from 'wouter-preact';
import {App} from './App.js';
import {NavRoot} from './navigation/NavRoot.js';
import './index.css';
import {useHashLocation} from './wouter-hash.js';
import {InputGuide} from './InputGuide.js';

const app = document.createElement('div');
document.body.append(app);

render(
	<NavRoot>
		<Router hook={useHashLocation}>
			<App />
		</Router>
	</NavRoot>,
	app,
);

const inputGuide = document.createElement('div');
document.body.append(inputGuide);
render(<InputGuide />, inputGuide);
