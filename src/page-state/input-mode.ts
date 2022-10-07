import {signal, effect} from '@preact/signals';

export type InputMode = 'keyboard' | 'ps' | 'xbox' | 'switch';
export const activeInputMode = signal<InputMode>('keyboard');

let lastInputMode: InputMode;

const keyboardActivationEvents = [
	'keydown',
	'pointerdown',
	'pointermove',
] as const;

const onKeyboardActive = () => {
	for (const name of keyboardActivationEvents) {
		document.body.removeEventListener(name, onKeyboardActive, {
			capture: true,
		});
	}

	activeInputMode.value = 'keyboard';
};

effect(() => {
	if (lastInputMode === activeInputMode.value) {
		return;
	}

	lastInputMode = activeInputMode.value;

	if (lastInputMode !== 'keyboard') {
		for (const name of keyboardActivationEvents) {
			document.body.addEventListener(name, onKeyboardActive, {
				capture: true,
				once: true,
				passive: true,
			});
		}
	}
});
