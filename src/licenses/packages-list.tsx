import {type FunctionComponent, lazy} from 'preact/compat';
import assert from '../assert.js';
import type * as Types from '../license-types.js';
import {NavColumn} from '../navigation/NavColumn.js';
import {Package} from './Package.js';

const createComponent = (file: string, route: string) =>
	lazy<FunctionComponent>(async () => {
		try {
			const response = await fetch(file, {
				credentials: 'omit',
				headers: new Headers({
					Accept: 'application/json',
				}),
				redirect: 'error',
			});

			assert(
				response.ok,
				`got status code ${response.status}: ${response.statusText}`,
			);

			const json = (await response.json()) as readonly Types.Package[];

			const LoadedPackagesList = () => (
				<NavColumn>
					{json.map((pkg) => (
						<Package
							pkg={pkg}
							key={`${pkg.name}@${pkg.version}`}
							route={route}
						/>
					))}
				</NavColumn>
			);
			return LoadedPackagesList;
		} catch (error) {
			console.error(error);
			const ErredPackagesList = () => <p>Failed to load the licenses list.</p>;
			return ErredPackagesList;
		}
	});

export const Dependencies = /* @__PURE__ */ createComponent(
	`${import.meta.env.BASE_URL}license-files/deps.json`,
	'/debug/licenses/',
);
