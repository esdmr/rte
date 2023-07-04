import type {FunctionComponent, JSX} from 'preact';
import * as css from './CircularButton.module.css';
import {classes} from './classes.js';
import {A, Button} from './navigation/wrappers.js';

export const CircularButton: FunctionComponent<
	Omit<JSX.HTMLAttributes<HTMLButtonElement | HTMLAnchorElement>, 'href'> & {
		href?: string;
		class?: string;
	}
> = (props) => {
	return typeof props.href === 'string' ? (
		<A
			{...props}
			href={props.href}
			class={classes(css.circular, props.class)}
			draggable={false}
		/>
	) : (
		<Button
			{...props}
			href={undefined}
			class={classes(css.circular, props.class)}
		/>
	);
};
