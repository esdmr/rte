import type {FunctionComponent, JSX} from 'preact';
import {classes} from './classes.js';
import {Link} from './Link.js';
import * as css from './CircularButton.module.css';
import {A, Button} from './navigation/wrappers.js';
import type {CompPageBuilder} from './composition/page.js';

export const CircularButton: FunctionComponent<
	Omit<JSX.HTMLAttributes<HTMLButtonElement | HTMLAnchorElement>, 'href'> & {
		href?: string | CompPageBuilder;
		newParameters?: any;
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
	) : props.href ? (
		<Link
			{...props}
			href={undefined}
			builder={props.href}
			newParameters={props.newParameters as unknown}
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
