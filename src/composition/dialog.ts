import type {ComponentChild} from 'preact';
import assert from '../assert.js';
import {CompositorLayer, useCompositorNode} from './layer.js';
import type {CompositorPage} from './page.js';
import {Result} from './result.js';

export class CompositorDialog<T> extends CompositorLayer {
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

	override dispose(): void {
		assert(this.result.state !== 'pending', 'Cannot dispose a pending dialog');
		super.dispose();
	}
}

export function useCompositorDialog<T = unknown>() {
	return useCompositorNode<CompositorDialog<T>>(CompositorDialog);
}

export function createDialog<T = unknown>(options: {
	readonly page: CompositorPage;
	readonly content: ComponentChild;
	readonly classes: readonly string[];
}) {
	const dialog = new CompositorDialog<T>();

	options.page.dialogs.append(dialog);
	dialog.classList.add(...options.classes);
	dialog.render(options.content);
	dialog.focus();

	return dialog;
}
