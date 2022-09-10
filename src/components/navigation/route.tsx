import {mdiArrowLeft} from '@mdi/js';
import {Icon} from '@mdi/react';
import type {FunctionComponent} from 'preact';
import {AllowScroll} from '../allow-scroll.js';
import {CircularButton} from '../circular-button.js';
import {Title} from '../title.js';
import {NavColumn} from './column.js';
import * as css from './route.module.css.js';
import {NavRow} from './row.js';
import {A, Div} from './wrappers.js';

export const DebugNav: FunctionComponent = () => (
	<>
		<AllowScroll />
		<NavColumn>
			<header>
				<nav>
					<CircularButton href="/">
						<Icon path={mdiArrowLeft} title="Back" />
					</CircularButton>
				</nav>
			</header>
			<main>
				<NavColumn>
					<Title h1>Debug navigation</Title>
					<div>Text 1</div>
					<Div>Focusable text 2</Div>
					<div>Text 3</div>
					<A>Anchor without href</A>
					<br />
					<A href="https://example.com">Anchor with href (Link)</A>
					<div class={css.flexColumn}>
						<NavRow>
							<Div>Column 1</Div>
							<Div>Column 2</Div>
							<Div>Column 3</Div>
						</NavRow>
					</div>

					<div class={css.flexRow}>
						<NavColumn>
							<Div>Row 1</Div>
							<Div>Row 2</Div>
							<Div>Row 3</Div>
						</NavColumn>
					</div>

					<div class={css.flexRow}>
						<NavColumn>
							<div class={css.flexColumn}>
								<NavRow>
									<Div>Row 1, Column 1</Div>
									<Div>Row 1, Column 2</Div>
									<Div>Row 1, Column 3</Div>
								</NavRow>
							</div>
							<div class={css.flexColumn}>
								<NavRow>
									<Div>Row 2, Column 1</Div>
									<Div>Row 2, Column 2</Div>
									<Div>Row 2, Column 3</Div>
								</NavRow>
							</div>
							<div class={css.flexColumn}>
								<NavRow>
									<Div>Row 3, Column 1</Div>
									<Div>Row 3, Column 2</Div>
									<Div>Row 3, Column 3</Div>
								</NavRow>
							</div>
						</NavColumn>
					</div>
				</NavColumn>
			</main>
		</NavColumn>
	</>
);
