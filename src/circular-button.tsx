import type {FunctionComponent, JSX} from 'preact';
import {classes} from './classes.js';
import {Link} from './Link.js';
import * as css from './circular-button.module.css.js';
import {A, Button} from './navigation/wrappers.js';

export const CircularButton: FunctionComponent<
	JSX.HTMLAttributes<HTMLButtonElement | HTMLAnchorElement> & {
		href?: string | undefined;
		class?: string | undefined;
		external?: boolean | undefined;
	}
> = (props) => {
	const Anchor = props.external ? A : Link;

	return props.href === undefined ? (
		<Button {...props} class={classes(css.circular, props.class)} />
	) : (
		<Anchor
			{...props}
			href={props.href}
			class={classes(css.circular, props.class)}
			draggable={false}
		/>
	);
};
