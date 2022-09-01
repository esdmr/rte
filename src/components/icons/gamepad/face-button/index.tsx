import type {FunctionComponent} from 'preact';
import {useClass} from '../../../../use-class.js';
import * as css from './index.module.css.js';
import type {Direction, FaceButtonStyle} from './types.js';

export const GamepadFaceButtonIcon: FunctionComponent<{
	style: FaceButtonStyle;
	which: Direction;
	class?: string;
}> = props => {
	const id = `gabi-mask-${props.style.name}-${props.which}`;
	const symbol = props.style[props.which];

	return <svg class={useClass(css.faceButton, props.class)} viewBox='-8 -8 16 16' data-style={props.style.name} data-which={props.which} aria-label={`Gamepad ${symbol.name} button`}>
		<circle cx={0} cy={0} r={8} class={css.base} mask={`url(#${id})`} />
		<defs aria-hidden>
			<mask id={id}>
				<rect x={-8} y={-8} width={16} height={16} class={css.maskOut} />
				<symbol.Icon />
			</mask>
		</defs>
	</svg>;
};

export * from './types.js';
export * from './text.js';
export * from './symbols.js';
