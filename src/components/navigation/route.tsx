import {mdiArrowLeft} from '@mdi/js';
import {Icon} from '@mdi/react';
import type {FunctionComponent} from 'preact';
import {AllowScroll} from '../allow-scroll.js';
import {CircularButton} from '../circular-button.js';
import {Title} from '../title.js';
import {NavColumn} from './column.js';
import {NavFlow} from './flow.js';
import {NavGrid} from './grid.js';
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
					<h2>Texts and Anchors</h2>
					<div>Text 1</div>
					<Div>Focusable text 2</Div>
					<div>Text 3</div>
					<A>Anchor without href</A>
					<br />
					<A href="https://example.com">Anchor with href (Link)</A>

					<h2>Flow</h2>
					<p>
						<NavFlow>
							Lorem ipsum dolor sit amet consectetur adipisicing elit.
							Accusantium cupiditate,{' '}
							<A href="https://example.com">temporibus incidunt</A> voluptate
							possimus magnam hic, ab tempore illum nemo tempora accusamus
							voluptatum nisi nobis eaque? Vero dolore numquam nulla? Lorem
							ipsum dolor sit amet consectetur{' '}
							<A href="https://example.com">adipisicing elit</A>. Fugit maxime
							nobis eaque asperiores sint mollitia commodi ea, rem doloremque
							fuga eius alias ut rerum vel ipsum velit quas facere deserunt?
						</NavFlow>
					</p>

					<h2>Columns</h2>
					<div class={css.flexColumn}>
						<NavRow>
							<Div>Column 1</Div>
							<Div>Column 2</Div>
							<Div>Column 3</Div>
						</NavRow>
					</div>

					<h2>Rows</h2>
					<div class={css.flexRow}>
						<NavColumn>
							<Div>Row 1</Div>
							<Div>Row 2</Div>
							<Div>Row 3</Div>
						</NavColumn>
					</div>

					<h2>Faux Grid (Row of Columns)</h2>
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

					<h2>Real Grid</h2>
					<div class={css.grid}>
						<NavGrid width={3}>
							<Div>Item 1, 1</Div>
							<Div>Item 1, 2</Div>
							<Div>Item 1, 3</Div>
							<Div>Item 2, 1</Div>
							<Div>Item 2, 2</Div>
							<Div>Item 2, 3</Div>
							<Div>Item 3, 1</Div>
							<Div>Item 3, 2</Div>
							<Div>Item 3, 3</Div>
						</NavGrid>
					</div>
				</NavColumn>
			</main>
		</NavColumn>
	</>
);
