import {mdiArrowLeft} from '@mdi/js';
import {Icon} from '@mdi/react';
import type {FunctionComponent} from 'preact';
import {AllowScroll} from '../AllowScroll.js';
import {CircularButton} from '../circular-button.js';
import {NavColumn} from '../navigation/NavColumn.js';
import {Title} from '../Title.js';
import {DebugGamepadState} from './DebugGamepadState.js';
import {GamepadToSignal} from './GamepadToSignal.js';

export const DebugGamepad: FunctionComponent = () => (
	<GamepadToSignal>
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
				<Title h1>Debug gamepad</Title>

				<DebugGamepadState />
			</main>
		</NavColumn>
	</GamepadToSignal>
);
