import type {FunctionComponent} from 'preact';
import {scrollable} from '../scrollable.module.css';
import {CloseButton} from '../composition/CloseButton.js';
import {CompPageBuilder} from '../composition/page.js';
import {NavColumn} from '../navigation/NavColumn.js';
import {NavRoot} from '../navigation/NavRoot.js';
import {DebugGamepadState} from './DebugGamepadState.js';

const DebugGamepad: FunctionComponent = () => (
	<NavRoot>
		<NavColumn>
			<header>
				<nav>
					<CloseButton />
				</nav>
			</header>
			<main>
				<h1>Debug gamepad</h1>

				<DebugGamepadState />
			</main>
		</NavColumn>
	</NavRoot>
);

export const debugGamepad = new CompPageBuilder(DebugGamepad, {});
debugGamepad.classList.push(scrollable);
