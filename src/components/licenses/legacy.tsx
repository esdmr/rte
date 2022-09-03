import type {FunctionComponent} from 'preact';
import type * as Types from '../../license-types.js';

export const LegacyLicense: FunctionComponent<{licenses: Types.LegacyLicense[]}> = props =>
	<>
		<p>This version uses legacy object <code>license</code>/<code>licenses</code> field.</p>
		<ul>
			{props.licenses.map(license =>
				<li>
					<a href={license.url}>
						{license.type ? <code>{license.type}</code> : '[unknown license]'}.
					</a>
				</li>,
			)}
		</ul>
	</>;
