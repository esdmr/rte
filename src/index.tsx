import {homePage} from './HomePage.js';
import {CompLayer} from './composition/layer.js';
import {CompWindow} from './composition/window.js';
import {InputGuide, setupInputGuide} from './gamepad/InputGuide.js';
import {guideContainer} from './gamepad/InputGuide.module.css';
import {setupGamepadSignal} from './gamepad/gamepad-signal.js';
import {setupGamepad} from './gamepad/loop.js';

if (import.meta.env.DEV) {
	await import('./debug-utils.js');
}

const window = new CompWindow(document.body);
setupInputGuide(window.pages);
setupGamepadSignal(window);

declare global {
	/** Used for debugging. Only available in development mode. */
	// eslint-disable-next-line no-var
	var compWindow: CompWindow | undefined;
}

if (import.meta.env.DEV) {
	globalThis.compWindow = window;
}

const homePageCopy = homePage.copy();
homePageCopy.showPageCloseButton = false;
homePageCopy.append(window);

const inputGuide = new CompLayer(document.createElement('aside'));
inputGuide.classList.add(guideContainer);
window.overlays.append(inputGuide);
inputGuide.render(<InputGuide />);

setupGamepad();
