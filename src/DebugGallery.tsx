import type {FunctionComponent} from 'preact';
import {scrollable} from './scrollable.module.css';
import * as css from './DebugGallery.module.css';
import {Loading} from './Loading.js';
import {CloseButton} from './composition/CloseButton.js';
import {CompPageBuilder} from './composition/page.js';
import * as gfbi from './icons/gamepad/face-button/index.js';
import {NavRoot} from './navigation/NavRoot.js';

const style = [gfbi.symbols, gfbi.lettersAb, gfbi.lettersBa] as const;
const which = ['down', 'right', 'left', 'up'] as const;

const DebugGallery: FunctionComponent = () => (
	<NavRoot>
		<header>
			<nav>
				<CloseButton />
			</nav>
		</header>
		<main>
			<h1>Debug Gallery</h1>

			<h2>Loading icon</h2>
			<Loading placement="center" />
			<Loading placement="bottom-right" />

			<h2>Gamepad face button icons</h2>
			{style.map((style) => (
				<figure class={css.inlineFigure} key={style.name}>
					<div class={css.gfbiGrid}>
						{which.map((which) => (
							<gfbi.GamepadFaceButtonIcon
								class={css.gfbi}
								style={style}
								which={which}
								key={which}
							/>
						))}
					</div>
					<figcaption>
						<code>{style.name}</code>
					</figcaption>
				</figure>
			))}
		</main>
	</NavRoot>
);

export const debugGallery = new CompPageBuilder(DebugGallery, {});
debugGallery.classList.push(scrollable);
