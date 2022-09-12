import {mdiArrowLeft} from '@mdi/js';
import {Icon} from '@mdi/react';
import type {FunctionComponent} from 'preact';
import {lazy, Suspense, useMemo} from 'preact/compat';
import assert from '../assert.js';
import {AllowScroll} from '../allow-scroll.js';
import {CircularButton} from '../circular-button.js';
import {Loading} from '../loading.js';
import {Title} from '../title.js';

export const LicenseFile: FunctionComponent<{
	id: string;
	'return-route': string;
}> = (props) => {
	const pkgId = decodeURIComponent(props.id);

	if (!/^(@.+?\/)?.+?@.+$/.test(pkgId)) {
		return (
			<>
				<AllowScroll />
				<header>
					<nav>
						<CircularButton href={props['return-route']}>
							<Icon path={mdiArrowLeft} title="Back" />
						</CircularButton>
					</nav>
				</header>
				<main>
					<Title h1>Invalid package id</Title>
					<p>
						<code>{pkgId}</code> is not a valid package name.
					</p>
				</main>
			</>
		);
	}

	const Content = useMemo(
		() =>
			lazy<FunctionComponent>(async () => {
				try {
					const response = await fetch(`/license-files/${pkgId}`, {
						credentials: 'omit',
						cache: 'force-cache',
						headers: new Headers({
							Accept: 'text/plain',
						}),
						redirect: 'error',
					});

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
		[pkgId],
	);

	return (
		<>
			<AllowScroll />
			<header>
				<nav>
					<CircularButton href={props['return-route']}>
						<Icon path={mdiArrowLeft} title="Back" />
					</CircularButton>
				</nav>
			</header>
			<main>
				<Title h1>License file for: {pkgId}</Title>
				<Suspense fallback={<Loading placement="center" />}>
					<Content />
				</Suspense>
			</main>
		</>
	);
};
