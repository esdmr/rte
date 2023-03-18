import {mdiHome} from '@mdi/js';
import {Icon} from '@mdi/react';
import type {FunctionComponent} from 'preact';
import {AllowScroll} from './AllowScroll.js';
import {CircularButton} from './CircularButton.js';
import {Title} from './Title.js';

export const UnknownRoute: FunctionComponent = () => (
	<>
		<AllowScroll />
		<header>
			<nav>
				<CircularButton href="/" title="Home">
					<Icon path={mdiHome} />
				</CircularButton>
			</nav>
		</header>
		<main>
			<Title h1>Page not found!</Title>
		</main>
	</>
);
