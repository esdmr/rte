import {mdiArrowLeft} from '@mdi/js';
import {Icon} from '@mdi/react';
import type {FunctionComponent} from 'preact';
import {lazy, Suspense, useMemo} from 'preact/compat';
import assert from '../assert.js';
import {AllowScroll} from '../AllowScroll.js';
import {CircularButton} from '../CircularButton.js';
import {Loading} from '../Loading.js';
import {Title} from '../Title.js';

export const LicenseFile: FunctionComponent<{
	label: string;
	path: string;
	dir: string;
	'is-package'?: boolean;
	'return-route': string;
}> = (props) => {
	const label = decodeURIComponent(props.label);
	const path = decodeURIComponent(props.path);

	if (props['is-package'] && !/^(@.+?\/)?.+?@.+$/.test(path)) {
		return (
			<>
				<AllowScroll />
				<header>
					<nav>
						<CircularButton
							href={props['return-route']}
							title="Back"
						>
							<Icon path={mdiArrowLeft} />
						</CircularButton>
					</nav>
				</header>
				<main>
					<Title h1>Invalid package id</Title>
					<p>
						<code>{path}</code> is not a valid package name.
					</p>
				</main>
			</>
		);
	}

	const Content = useMemo(
		() =>
			lazy<FunctionComponent>(async () => {
				try {
					const response = await fetch(
						`${import.meta.env.BASE_URL}${props.dir}${path}`,
						{
							credentials: 'omit',
							cache: 'force-cache',
							headers: new Headers({
								Accept: 'text/plain',
							}),
							redirect: 'error',
						},
					);

					assert(
						response.ok,
						`got status code ${response.status}: ${response.statusText}`,
					);

					const text = await response.text();
					const LoadedLicenseFile = () => <pre>{text}</pre>;
					return LoadedLicenseFile;
				} catch (error) {
					console.error(error);
					const ErredLicenseFile = () => (
						<p>Failed to load the license file.</p>
					);
					return ErredLicenseFile;
				}
			}),
		[path],
	);

	return (
		<>
			<AllowScroll />
			<header>
				<nav>
					<CircularButton href={props['return-route']} title="Back">
						<Icon path={mdiArrowLeft} />
					</CircularButton>
				</nav>
			</header>
			<main>
				<Title h1>License file for: {label}</Title>
				<Suspense fallback={<Loading placement="center" />}>
					<Content />
				</Suspense>
			</main>
		</>
	);
};
