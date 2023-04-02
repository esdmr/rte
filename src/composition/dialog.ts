import type {ComponentChild} from 'preact';
import assert from '../assert.js';
import {CompLayer} from './layer.js';
import type {CompPage} from './page.js';
import {Result} from './result.js';

export class CompDialog<T> extends CompLayer {
	readonly result = new Result<T>();

	constructor(element?: HTMLElement) {
		super(element);
		this.role = 'alertdialog';

		this.result.promise
			.catch(() => undefined)
			.finally(() => {
				this.dispose();
			});
	}

	override dispose() {
		assert(
			this.result.state !== 'pending',
			'Cannot dispose a pending dialog',
		);
		super.dispose();
	}
}

export function createDialog<T = unknown>(options: {
	readonly page: CompPage;
	readonly content: ComponentChild;
	readonly classes: readonly string[];
}) {
	const dialog = new CompDialog<T>();

	options.page.dialogs.append(dialog);
	dialog.classList.add(...options.classes);
	dialog.render(options.content);
	dialog.focus();

	return dialog;
}
