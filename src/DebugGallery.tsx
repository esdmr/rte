import {mdiArrowLeft} from '@mdi/js';
import {Icon} from '@mdi/react';
import type {FunctionComponent} from 'preact';
import {AllowScroll} from './AllowScroll.js';
import {CircularButton} from './CircularButton.js';
import * as css from './DebugGallery.module.css';
import {Loading} from './Loading.js';
import * as gfbi from './icons/gamepad/face-button/index.js';

const style = [gfbi.symbols, gfbi.lettersAb, gfbi.lettersBa] as const;
const which = ['down', 'right', 'left', 'up'] as const;

export const DebugGallery: FunctionComponent = () => (
	<>
		<AllowScroll />
		<header>
			<nav>
				<CircularButton href="/" title="Back">
					<Icon path={mdiArrowLeft} />
				</CircularButton>
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
	</>
);
