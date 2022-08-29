import type {FunctionComponent} from 'preact';
import './loading.css';

export const Loading: FunctionComponent<{class?: string}> = props => (
	<div
		class={`loading ${props.class ?? ''}`.trim()}
		role='alert'
		aria-busy='true'
		aria-describedby='loading-title'
	>
		<svg viewBox='-2.5 -0.5 5 1' xmlns='http://www.w3.org/2000/svg'>
			<title id='loading-title'>Loading</title>
			{[-2, 0, 2].map((cx, i) => (
				<circle cx={cx} cy='0' r='0.5' style={{'--index': i}} />
			))}
		</svg>
	</div>
);
