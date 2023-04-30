import {mdiArrowLeft} from '@mdi/js';
import {Icon} from '@mdi/react';
import type {FunctionComponent} from 'preact';
import {AllowScroll} from '../AllowScroll.js';
import {CircularButton} from '../CircularButton.js';
import {NavColumn} from '../navigation/NavColumn.js';
import {DebugGamepadState} from './DebugGamepadState.js';

export const DebugGamepad: FunctionComponent = () => (
	<>
		<AllowScroll />
		<NavColumn>
			<header>
				<nav>
					<CircularButton href="/" title="Back">
						<Icon path={mdiArrowLeft} />
					</CircularButton>
				</nav>
			</header>
			<main>
				<h1>Debug gamepad</h1>

				<DebugGamepadState />
			</main>
		</NavColumn>
	</>
);
