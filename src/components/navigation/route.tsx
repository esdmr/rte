import {mdiArrowLeft} from '@mdi/js';
import {Icon} from '@mdi/react';
import type {FunctionComponent} from 'preact';
import {AllowScroll} from '../allow-scroll.js';
import {CircularButton} from '../circular-button.js';
import {Title} from '../title.js';
import * as css from './index.module.css.js';
import {A} from './wrappers.js';
import {NavColumn, NavItem, NavRow} from './index.js';

export const DebugNav: FunctionComponent = () => <>
	<AllowScroll />
	<NavColumn>
		<header>
			<nav>
				<CircularButton href='/'>
					<Icon path={mdiArrowLeft} title='Back' />
				</CircularButton>
			</nav>
		</header>
		<main>
			<NavColumn>
				<Title h1>Debug navigation</Title>
				<div>Text 1</div>
				<NavItem><div>Focusable text 2</div></NavItem>
				<div>Text 3</div>
				<A>Anchor without href</A>
				<br />
				<A href='https://example.com'>Anchor with href (Link)</A>
				<div class={css.flexColumn}>
					<NavRow>
						<NavItem><div>Column 1</div></NavItem>
						<NavItem><div>Column 2</div></NavItem>
						<NavItem><div>Column 3</div></NavItem>
					</NavRow>
				</div>

				<div class={css.flexRow}>
					<NavColumn>
						<NavItem><div>Row 1</div></NavItem>
						<NavItem><div>Row 2</div></NavItem>
						<NavItem><div>Row 3</div></NavItem>
					</NavColumn>
				</div>

				<div class={css.flexRow}>
					<NavColumn>
						<div class={css.flexColumn}>
							<NavRow>
								<NavItem><div>Row 1, Column 1</div></NavItem>
								<NavItem><div>Row 1, Column 2</div></NavItem>
								<NavItem><div>Row 1, Column 3</div></NavItem>
							</NavRow>
						</div>
						<div class={css.flexColumn}>
							<NavRow>
								<NavItem><div>Row 2, Column 1</div></NavItem>
								<NavItem><div>Row 2, Column 2</div></NavItem>
								<NavItem><div>Row 2, Column 3</div></NavItem>
							</NavRow>
						</div>
						<div class={css.flexColumn}>
							<NavRow>
								<NavItem><div>Row 3, Column 1</div></NavItem>
								<NavItem><div>Row 3, Column 2</div></NavItem>
								<NavItem><div>Row 3, Column 3</div></NavItem>
							</NavRow>
						</div>
					</NavColumn>
				</div>
			</NavColumn>
		</main>
	</NavColumn>
</>;
