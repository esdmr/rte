import type {FunctionComponent, JSX} from 'preact';
import {classes} from './classes.js';
import {Link} from './Link.js';
import * as css from './circular-button.module.css.js';
import {Button} from './navigation/wrappers.js';

export const CircularButton: FunctionComponent<
	JSX.HTMLAttributes<HTMLButtonElement | HTMLAnchorElement>
> = (props) =>
	props.href === undefined ? (
		<Button {...props} class={classes(css.circular, props.class)} />
	) : (
		<Link
			{...props}
			href={props.href}
			class={classes(css.circular, props.class)}
			draggable={false}
		/>
	);
