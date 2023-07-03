import type {FunctionComponent} from 'preact';
import {AllowScroll} from '../AllowScroll.js';
import {CloseButton} from '../composition/CloseButton.js';
import {NavColumn} from '../navigation/NavColumn.js';
import {CompPageBuilder} from '../composition/page.js';
import {NavRoot} from '../navigation/NavRoot.js';
import {DebugGamepadState} from './DebugGamepadState.js';

export const DebugGamepad: FunctionComponent = () => (
	<>
		<AllowScroll />
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
	</>
);

export const debugGamepad = new CompPageBuilder(
	() => (
		<NavRoot>
			<DebugGamepad />
		</NavRoot>
	),
	{},
);
