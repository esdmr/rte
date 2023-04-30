import {signal} from '@preact/signals';
import type {FunctionComponent} from 'preact';
import * as css from './InputGuide.module.css';
import {activeInputMode, type InputMode} from './gamepad/input-mode.js';

export type InputGuideIcon = {
	readonly Icon: FunctionComponent;
	readonly mode: InputMode;
};

export type InputGuideEntry = {
	readonly text: string;
	readonly icons: readonly InputGuideIcon[];
};

export const inputGuideEntries = signal<readonly InputGuideEntry[]>([]);

export const InputGuide: FunctionComponent = () => (
	<ul
		class={css.guide}
		aria-label="Input guide"
		aria-live="polite"
		hidden={inputGuideEntries.value.length === 0}
	>
		{inputGuideEntries.value.map(({text, icons}) => {
			const icon = icons.find(
				(icon) => icon.mode === activeInputMode.value,
			);

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
