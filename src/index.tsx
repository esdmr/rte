import {Router} from 'wouter-preact';
import {App} from './App.js';
import {NavRoot} from './navigation/NavRoot.js';
import {guideContainer} from './gamepad/InputGuide.module.css';
import {useHashLocation} from './wouter-hash.js';
import {InputGuide, setupInputGuide} from './gamepad/InputGuide.js';
import {CompWindow} from './composition/window.js';
import {CompPage} from './composition/page.js';
import {CompLayer} from './composition/layer.js';
import {setupGamepadSignal} from './gamepad/gamepad-signal.js';

if (import.meta.env.DEV) {
	await import('./debug-utils.js');
}

const window = new CompWindow(document.body);
setupInputGuide(window.pages);

const app = new CompPage(document.createElement('div'));
app.content.classList.add('app');
window.pages.append(app);
setupGamepadSignal(app.content);

app.content.render(
	<NavRoot>
		<Router hook={useHashLocation}>
			<App />
		</Router>
	</NavRoot>,
);

const inputGuide = new CompLayer(document.createElement('aside'));
inputGuide.classList.add(guideContainer);
window.overlays.append(inputGuide);
inputGuide.render(<InputGuide />);
