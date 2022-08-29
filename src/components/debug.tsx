import type {FunctionComponent} from 'preact';
import * as css from './debug.module.css.js';
import {GamepadFaceButtonIcon} from './icons/gamepad-face-button.js';
import {Loading} from './loading.js';

const style = ['symbols', 'letters-ab', 'letters-ba', 'numbers-bolt', 'numbers-circle'] as const;
const which = ['down', 'right', 'left', 'up'] as const;

export const Debug: FunctionComponent = () => <div>
	<Loading />
	{style.map(style =>
		<div class={css.gamepadFaceButtonGrid}>
			{which.map(which => <GamepadFaceButtonIcon class={css.gamepadFaceButtonIcon} style={style} which={which} />,
			)}
		</div>,
	)}
</div>;
