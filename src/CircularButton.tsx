import type {FunctionComponent, JSX} from 'preact';
import {classes} from './classes.js';
import {Link} from './Link.js';
import * as css from './CircularButton.module.css';
import {A, Button} from './navigation/wrappers.js';

export const CircularButton: FunctionComponent<
	Omit<JSX.HTMLAttributes<HTMLButtonElement | HTMLAnchorElement>, 'href'> & {
		href?: string;
		class?: string;
		external?: boolean;
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
