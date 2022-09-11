import type {FunctionComponent} from 'preact';
import {classes} from '../classes.js';

export const Notification: FunctionComponent<{class?: string}> = (props) => (
	<div class={classes('notification', props.class)}>{/* TODO */}</div>
);
