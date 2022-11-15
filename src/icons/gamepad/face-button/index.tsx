import type {FunctionComponent} from 'preact';
import {useId} from 'preact/hooks';
import {classes} from '../../../classes.js';
import * as css from './index.module.css.js';
import type {Direction, FaceButtonStyle} from './types.js';

export const GamepadFaceButtonIcon: FunctionComponent<{
	style: FaceButtonStyle;
	which: Direction;
	rotate?: '0' | '90deg' | '-90deg';
	class?: string;
}> = (props) => {
	// `useId` does not seem to be fully unique. Suffix it with the props to
	// make it unique.
	const id = `${useId()}-${props.style.name}-${props.which}`;
	const symbol = props.style[props.which];

	return (
		<svg
			class={classes(css.faceButton, props.class)}
			viewBox="-8 -8 16 16"
			style={{transform: `rotate(${props.rotate ?? '0'})`}}
			data-style={props.style.name}
			data-which={props.which}
			aria-label={`Gamepad ${symbol.name} button`}
		>
			<circle
				cx={0}
				cy={0}
				r={8}
				class={css.base}
				mask={`url(#${CSS.escape(id)})`}
			/>
			<defs aria-hidden>
				<mask id={id}>
					<rect x={-8} y={-8} width={16} height={16} class={css.maskOut} />
					<symbol.Icon />
				</mask>
			</defs>
		</svg>
	);
};

export * from './types.js';
export * from './text.js';
export * from './symbols.js';
