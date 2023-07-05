import type {FunctionComponent} from 'preact';
import {lazy, Suspense, useMemo} from 'preact/compat';
import {scrollable} from '../scrollable.module.css';
import assert from '../assert.js';
import {CloseButton} from '../composition/CloseButton.js';
import {CompPageBuilder} from '../composition/page.js';
import {Loading} from '../Loading.js';
import {NavRoot} from '../navigation/NavRoot.js';

const LicenseFile: FunctionComponent<{
	label: string;
	path: string;
	dir: string;
	'is-package'?: boolean;
}> = (props) => {
	const label = props.label;
	const path = props.path;

	if (props['is-package']) {
		assert(
			/^(@.+?\/)?.+?@.+$/.test(path),
			`“${path}” is not a valid package name`,
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
		<NavRoot>
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
		</NavRoot>
	);
};

export const licenseFile = new CompPageBuilder(LicenseFile, {
	path: '(uninitialized)',
	label: '(uninitialized)',
	dir: '(uninitialized)/',
});

licenseFile.classList.push(scrollable);
