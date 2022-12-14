import {mdiArrowLeft} from '@mdi/js';
import {Icon} from '@mdi/react';
import type {FunctionComponent} from 'preact';
import {AllowScroll} from '../AllowScroll.js';
import {CircularButton} from '../circular-button.js';
import {Title} from '../Title.js';
import {NavColumn} from './NavColumn.js';
import {NavFlow} from './NavFlow.js';
import {NavGrid} from './NavGrid.js';
import * as css from './DebugNav.module.css.js';
import {NavRow} from './NavRow.js';
import {A, Button} from './wrappers.js';

export const DebugNav: FunctionComponent = () => (
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
				<NavColumn>
					<Title h1>Debug navigation</Title>
					<h2>Texts and Anchors</h2>
					<div>Text 1</div>
					<Button>Focusable button 2</Button>
					<div>Text 3</div>
					<A role="presentation">Anchor without href</A>
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
							<Button>Column 1</Button>
							<Button>Column 2</Button>
							<Button>Column 3</Button>
						</NavRow>
					</div>

					<h2>Rows</h2>
					<div class={css.flexRow}>
						<NavColumn>
							<Button>Row 1</Button>
							<Button>Row 2</Button>
							<Button>Row 3</Button>
						</NavColumn>
					</div>

					<h2>Faux Grid (Row of Columns)</h2>
					<div class={css.flexRow}>
						<NavColumn>
							<div class={css.flexColumn}>
								<NavRow>
									<Button>Row 1, Column 1</Button>
									<Button>Row 1, Column 2</Button>
									<Button>Row 1, Column 3</Button>
								</NavRow>
							</div>
							<div class={css.flexColumn}>
								<NavRow>
									<Button>Row 2, Column 1</Button>
									<Button>Row 2, Column 2</Button>
									<Button>Row 2, Column 3</Button>
								</NavRow>
							</div>
							<div class={css.flexColumn}>
								<NavRow>
									<Button>Row 3, Column 1</Button>
									<Button>Row 3, Column 2</Button>
									<Button>Row 3, Column 3</Button>
								</NavRow>
							</div>
						</NavColumn>
					</div>

					<h2>Real Grid</h2>
					<div class={css.grid}>
						<NavGrid width={3}>
							<Button>Item 1, 1</Button>
							<Button>Item 1, 2</Button>
							<Button>Item 1, 3</Button>
							<Button>Item 2, 1</Button>
							<Button>Item 2, 2</Button>
							<Button>Item 2, 3</Button>
							<Button>Item 3, 1</Button>
							<Button>Item 3, 2</Button>
							<Button>Item 3, 3</Button>
						</NavGrid>
					</div>
				</NavColumn>
			</main>
		</NavColumn>
	</>
);
