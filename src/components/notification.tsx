import type {FunctionComponent} from 'preact';
import {useClass} from '../use-class.js';

export const Notification: FunctionComponent<{class?: string}> = (props) => (
	<div class={useClass('notification', props.class)}>{/* TODO */}</div>
);
