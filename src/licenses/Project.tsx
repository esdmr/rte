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
import type {CompPageBuilder} from '../composition/page.js';
import {Authors} from './Authors.js';
import * as css from './Project.module.css';

export const Project: FunctionComponent<{
	readonly heading: ComponentChild;
	readonly authors?: readonly string[];
	readonly name: string;
	readonly repository?: string | [CompPageBuilder, any];
	readonly registry?: string | [CompPageBuilder, any];
	readonly source?: string | [CompPageBuilder, any];
	readonly license?: string | [CompPageBuilder, any];
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
					<NavRow>
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
						].map(
							([link, icon, type]) =>
								link && (
									<CircularButton
										key={type}
										href={
											Array.isArray(link) ? link[0] : link
										}
										newParameters={
											Array.isArray(link) &&
											(link[1] as unknown)
										}
										title={`See ${type}`}
										aria-label={`See ${type} for ${props.name}`}
									>
										<Icon path={icon} />
									</CircularButton>
								),
						)}
					</NavRow>
				</div>
			</NavRow>
		</article>
	);
};
