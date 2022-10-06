import type {FunctionComponent} from 'preact';
import type * as Types from '../license-types.js';
import {A} from '../navigation/wrappers.js';

export const LegacyLicense: FunctionComponent<{
	license: Types.LegacyLicense;
}> = (props) => (
	<>
		<p>
			This version uses legacy object <code>license</code>/<code>licenses</code>{' '}
			field.
		</p>
		<ul>
			{props.license.entries.map((license) => (
				<li>
					<A href={license.url}>
						{license.type ? <code>{license.type}</code> : '[unknown license]'}.
					</A>
				</li>
			))}
		</ul>
	</>
);
