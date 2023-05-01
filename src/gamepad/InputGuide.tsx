import {signal, type Signal} from '@preact/signals';
import type {FunctionComponent} from 'preact';
import type {CompNode} from '../composition/node.js';
import * as css from './InputGuide.module.css';
import {activeInputMode, type InputMode} from './input-mode.js';
import {InputGuideUpdateEvent} from './event.js';

export type InputGuideIcon = {
	readonly Icon: FunctionComponent;
	readonly mode: InputMode;
};

export type InputGuideEntry = {
	readonly text: string;
	readonly id?: symbol | undefined;
	readonly icons: readonly InputGuideIcon[];
};

export const inputGuideEntries: Signal<readonly InputGuideEntry[]> = signal([]);

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

export function setupInputGuide(root: CompNode, signal?: AbortSignal) {
	let lastActiveElement: Element | undefined;

	root.addEventListener(
		'focusin',
		() => {
			if (document.activeElement === lastActiveElement) {
				return;
			}

			requestInputGuideUpdate();
			lastActiveElement = document.activeElement ?? undefined;
		},
		{signal},
	);
}

export function requestInputGuideUpdate() {
	const event = new InputGuideUpdateEvent();

	if (document.activeElement?.dispatchEvent(event)) {
		const oldEntries = inputGuideEntries.peek();
		const newEntries = event.entries;

		if (
			newEntries.length !== oldEntries.length ||
			newEntries.some(
				(entry, i) => !entry.id || entry.id !== oldEntries[i]!.id,
			)
		) {
			inputGuideEntries.value = newEntries;
		}
	}
}
