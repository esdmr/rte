import {
	mdiCopyright,
	mdiSourceCommit,
	mdiSourceRepository,
	mdiStore,
} from '@mdi/js';
import {Icon} from '@mdi/react';
import type {ComponentChild, FunctionComponent} from 'preact';
import {CircularButton} from '../circular-button.js';
import {classes} from '../classes.js';
import {NavRow} from '../navigation/NavRow.js';
import {Authors} from './Authors.js';
import * as css from './Project.module.css.js';

export const encodePkgId = (pkgId: string) => {
	return encodeURIComponent(pkgId).replace(/%40/g, '@').replace(/%2F/g, '/');
};

type ProjectLink = {
	readonly href: string;
	readonly external?: boolean;
};

export const Project: FunctionComponent<{
	readonly heading: ComponentChild;
	readonly authors?: readonly string[];
	readonly name: string;
	readonly repository?: ProjectLink;
	readonly registry?: ProjectLink;
	readonly source?: ProjectLink;
	readonly license?: ProjectLink;
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
										href={link.href}
										external={link.external}
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
