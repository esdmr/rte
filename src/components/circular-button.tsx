import type {FunctionComponent, JSX} from 'preact';
import {useClass} from '../use-class.js';
import {Link} from './link.js';
import * as css from './circular-button.module.css.js';

export const CircularButton: FunctionComponent<JSX.HTMLAttributes<HTMLButtonElement | HTMLAnchorElement>> = props => props.href === undefined ? <button {...props} class={useClass(css.circular, props.class)} /> : <Link {...props} href={props.href} class={useClass(css.circular, props.class)} />;