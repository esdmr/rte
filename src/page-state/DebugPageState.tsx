import {mdiArrowLeft} from '@mdi/js';
import {Icon} from '@mdi/react';
import type {FunctionComponent} from 'preact';
import {AllowScroll} from '../AllowScroll.js';
import {CircularButton} from '../circular-button.js';
import {NavColumn} from '../navigation/NavColumn.js';
import {Title} from '../Title.js';
import {DebugTitle} from './DebugTitle.js';

export const DebugPageState: FunctionComponent = () => (
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
				<Title h1>Debug page state</Title>

				<h2>Title</h2>
				<DebugTitle />
			</main>
		</NavColumn>
	</>
);
