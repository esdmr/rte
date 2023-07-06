import {
	mdiCopyright,
	mdiSourceCommit,
	mdiSourceRepository,
	mdiStore,
} from '@mdi/js';
import {Icon} from '@mdi/react';
import type {ComponentChild, FunctionComponent} from 'preact';
import {CircularButton} from '../CircularButton.js';
import {classes} from '../classes.js';
import {NavRow} from '../navigation/NavRow.js';
import {NavColumn} from '../navigation/NavColumn.js';
import {Authors} from './Authors.js';
import * as css from './Project.module.css';

export const Project: FunctionComponent<{
	readonly heading: ComponentChild;
	readonly authors?: readonly string[];
	readonly name: string;
	readonly repository?: string | (() => void);
	readonly registry?: string | (() => void);
	readonly source?: string | (() => void);
	readonly license?: string | (() => void);
}> = (props) => {
	return (
		<article class={classes(css.project)}>
			<NavRow>
				<div class={css.content} role="presentation">
					<h3 class={css.heading} children={props.heading} />
					{props.authors && (
						<p>
							By <Authors list={props.authors} />.
						</p>
					)}
					{props.children}
				</div>
				<div class={css.icon} role="presentation">
					<NavColumn>
						{[
							[
								props.registry,
								mdiStore,
								'registry page',
							] as const,
							[
								props.repository,
								mdiSourceRepository,
								'repository',
							] as const,
							[
								props.source,
								mdiSourceCommit,
								'source code',
							] as const,
							[
								props.license,
								mdiCopyright,
								'license file',
							] as const,
						].map(([link, icon, type]) => {
							if (!link) return;

							const linkProps =
								typeof link === 'function'
									? {onClick: link}
									: {href: link};

							return (
								<CircularButton
									key={type}
									{...linkProps}
									title={`See ${type}`}
									aria-label={`See ${type} for ${props.name}`}
								>
									<Icon path={icon} />
								</CircularButton>
							);
						})}
					</NavColumn>
				</div>
			</NavRow>
		</article>
	);
};
