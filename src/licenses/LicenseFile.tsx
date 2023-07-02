import type {FunctionComponent} from 'preact';
import {lazy, Suspense, useMemo} from 'preact/compat';
import {AllowScroll} from '../AllowScroll.js';
import assert from '../assert.js';
import {Loading} from '../Loading.js';
import {CloseButton} from '../composition/CloseButton.js';

export const LicenseFile: FunctionComponent<{
	label: string;
	path: string;
	dir: string;
	'is-package'?: boolean;
}> = (props) => {
	const label = decodeURIComponent(props.label);
	const path = decodeURIComponent(props.path);

	if (props['is-package'] && !/^(@.+?\/)?.+?@.+$/.test(path)) {
		return (
			<>
				<AllowScroll />
				<header>
					<nav>
						<CloseButton />
					</nav>
				</header>
				<main>
					<h1>Invalid package id</h1>
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
					<CloseButton />
				</nav>
			</header>
			<main>
				<h1>License file for: {label}</h1>
				<Suspense fallback={<Loading placement="center" />}>
					<Content />
				</Suspense>
			</main>
		</>
	);
};
