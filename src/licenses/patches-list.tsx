import {type FunctionComponent, lazy} from 'preact/compat';
import assert from '../assert.js';
import type * as Types from '../license-types.js';
import {NavColumn} from '../navigation/NavColumn.js';
import {Patch} from './Patch.js';

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

			const json = (await response.json()) as readonly Types.Patch[];

			const LoadedPatchesList = () => (
				<NavColumn>
					{json.map((patch) => (
						<Patch
							patch={patch}
							key={`${patch.name}@${patch.version}`}
							route={route}
						/>
					))}
				</NavColumn>
			);
			return LoadedPatchesList;
		} catch (error) {
			console.error(error);
			const ErredPatchesList = () => (
				<p>Failed to load the patch licenses list.</p>
			);
			return ErredPatchesList;
		}
	});

export const Patches = /* @__PURE__ */ createComponent(
	`${import.meta.env.BASE_URL}licenses/patches/index.json`,
	'/debug/licenses/',
);
