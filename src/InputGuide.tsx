import {signal} from '@preact/signals';
import type {FunctionComponent} from 'preact';
import * as css from './InputGuide.module.css.js';

export type InputMode = 'keyboard' | 'ps' | 'xbox' | 'switch';

export type InputGuideIcon = {
	readonly Icon: FunctionComponent;
	readonly mode: InputMode;
};

export type InputGuideEntry = {
	readonly text: string;
	readonly icons: readonly InputGuideIcon[];
};

export const activeInputMode = signal<InputMode>('keyboard');
export const inputGuideEntries = signal<readonly InputGuideEntry[]>([]);

export const InputGuide: FunctionComponent = () => (
	<ul class={css.guide} aria-label="Input guide" aria-live="polite">
		{inputGuideEntries.value.map(({text, icons}) => {
			const icon = icons.find((icon) => icon.mode === activeInputMode.value);

			return icon ? (
				<li class={css.entry} key={text}>
					<span class={css.icon} role="presentation">
						<icon.Icon />
					</span>
					<span>{text}</span>
				</li>
			) : undefined;
		})}
	</ul>
);
