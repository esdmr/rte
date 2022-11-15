// eslint-disable-next-line import/no-unassigned-import
import 'preact/debug';
import {render} from 'preact';
import {Router} from 'wouter-preact';
import {App} from './App.js';
import {NavRoot} from './navigation/NavRoot.js';
import './index.css';
import {guideContainer} from './InputGuide.module.css.js';
import {useHashLocation} from './wouter-hash.js';
import {InputGuide} from './InputGuide.js';

if (import.meta.env.DEV) {
	await import('./debug-utils.js');
}

const app = document.createElement('div');
app.classList.add('app');
app.setAttribute('role', 'presentation');
document.body.append(app);

render(
	<NavRoot>
		<Router hook={useHashLocation}>
			<App />
		</Router>
	</NavRoot>,
	app,
);

const inputGuide = document.createElement('aside');
inputGuide.classList.add(guideContainer);
document.body.append(inputGuide);
render(<InputGuide />, inputGuide);
