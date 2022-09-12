import {mdiArrowLeft} from '@mdi/js';
import {Icon} from '@mdi/react';
import type {FunctionComponent} from 'preact';
import {AllowScroll} from './allow-scroll.js';
import {CircularButton} from './circular-button.js';
import * as css from './debug-gallery.module.css.js';
import * as gfbi from './icons/gamepad/face-button/index.js';
import {Loading} from './loading.js';
import {Title} from './title.js';

const style = [gfbi.symbols, gfbi.lettersAb, gfbi.lettersBa] as const;
const which = ['down', 'right', 'left', 'up'] as const;

export const DebugGallery: FunctionComponent = () => (
	<main>
		<AllowScroll />
		<header>
			<nav>
				<CircularButton href="/">
					<Icon path={mdiArrowLeft} title="Back" />
				</CircularButton>
			</nav>
		</header>
		<main>
			<Title h1>Debug Gallery</Title>

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
	</main>
);
