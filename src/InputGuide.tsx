import {signal} from '@preact/signals';
import type {FunctionComponent} from 'preact';
import * as css from './InputGuide.module.css.js';

export type InputMode = 'keyboard' | 'ps' | 'xbox' | 'switch';

export type InputGuideIcon = {
	Icon: FunctionComponent;
	mode: InputMode;
};

export type InputGuideEntry = {
	text: string;
	icons: InputGuideIcon[];
};

export const activeMode = signal<InputMode>('keyboard');
export const guideEntries = signal<InputGuideEntry[]>([]);

export const InputGuide: FunctionComponent = () => (
	<ul class={css.guide} aria-label="Input guide" aria-live="polite">
		{guideEntries.value.map(({text, icons}) => {
			const icon = icons.find((icon) => icon.mode === activeMode.value);

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
