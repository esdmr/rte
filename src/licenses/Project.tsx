import {mdiCopyright, mdiGithub, mdiNpm, mdiSourceCommit} from '@mdi/js';
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
	readonly authors?: readonly string[] | undefined;
	readonly name: string;
	readonly github?: ProjectLink | undefined;
	readonly npm?: ProjectLink | undefined;
	readonly source?: ProjectLink | undefined;
	readonly license?: ProjectLink | undefined;
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
							[props.github, mdiGithub, 'GitHub page'] as const,
							[props.npm, mdiNpm, 'NPM page'] as const,
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
										title={`See ${type}`}
										aria-label={`See ${type} for ${props.name}`}
										external={link.external}
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
