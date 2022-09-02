import type {FunctionComponent} from 'preact';
import {useClass} from '../use-class.js';
import * as css from './loading.module.css.js';

export const Loading: FunctionComponent<{
	class?: string;
	placement: 'center' | 'bottom-right';
}> = props => (
	<div
		class={useClass(css.loading, props.class)}
		role='alert'
		aria-busy='true'
		aria-labelledby='loading'
		data-placement={props.placement}
	>
		<svg viewBox='-2.5 -0.5 5 1' xmlns='http://www.w3.org/2000/svg' id='loading'
			aria-label='Loading'>
			{[-2, 0, 2].map((cx, i) => (
				<circle cx={cx} cy='0' r='0.5' style={{'--index': i}} />
			))}
		</svg>
	</div>
);
