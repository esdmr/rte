import type {FunctionComponent} from 'preact';
import {useClass} from '../use-class.js';
import * as css from './loading.module.css.js';

const circlesCount = 3;

export const Loading: FunctionComponent<{
	class?: string;
	placement: 'center' | 'bottom-right';
}> = (props) => (
	<div
		class={useClass(css.loading, props.class)}
		role="alert"
		aria-busy="true"
		aria-labelledby="loading"
		data-placement={props.placement}
	>
		<svg
			viewBox={`-0.25 -0.25 ${circlesCount - 0.5} 0.5`}
			xmlns="http://www.w3.org/2000/svg"
			id="loading"
			style={{'--count': circlesCount}}
			aria-label="Loading"
		>
			{Array.from({length: circlesCount}, (_, index) => (
				<circle
					cx={index}
					cy="0"
					r="0.25"
					style={{'--step': index / circlesCount}}
					key={index}
				/>
			))}
		</svg>
	</div>
);
