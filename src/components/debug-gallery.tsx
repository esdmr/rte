import type {FunctionComponent} from 'preact';
import * as css from './debug-gallery.module.css.js';
import * as gfbi from './icons/gamepad/face-button/index.js';
import {Loading} from './loading.js';
import {Title} from './title.js';

const style = [gfbi.symbols, gfbi.lettersAb, gfbi.lettersBa] as const;
const which = ['down', 'right', 'left', 'up'] as const;

export const DebugGallery: FunctionComponent = () => <main>
	<Title>Debug gallery</Title>
	<h1>Debug gallery</h1>

	<h2>Loading icon</h2>
	<Loading />

	<h2>Gamepad face button icons</h2>
	{style.map(style =>
		<figure class={css.inlineFigure}>
			<div class={css.gfbiGrid}>
				{which.map(which => <gfbi.GamepadFaceButtonIcon class={css.gfbi} style={style} which={which} />,
				)}
			</div>
			<figcaption><code>{style.name}</code></figcaption>
		</figure>,
	)}
</main>;
