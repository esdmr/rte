import {FunctionComponent, h} from 'preact';

const EditorSpinner: FunctionComponent = () => (
	<div class='editor editor-spinner' role='alert' aria-busy='true'>
		<svg viewBox='-0.5 -0.5 5 1' width='5em' xmlns='http://www.w3.org/2000/svg'>
			{[0, 2, 4].map((cx, i) => (
				<circle cx={cx} cy='0' r='0.5' fill='#aaa' style={{'--index': i}} />
			))}
		</svg>
	</div>
);
export default EditorSpinner;
