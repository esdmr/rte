import type {ComponentFactory, RenderableProps} from 'preact';
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
				this.disposeAndSetFocus();
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

export class CompDialogBuilder<T, D = unknown> {
	readonly classList: string[] = [];

	constructor(
		readonly content: ComponentFactory<T>,
		readonly parameters: RenderableProps<T>,
	) {}

	withType<NewD>() {
		// Work around TypeScript’s nonexistent partial inference feature.
		return this as unknown as CompDialogBuilder<T, NewD>;
	}

	copy() {
		const builder = new CompDialogBuilder<T, D>(
			this.content,
			this.parameters,
		);
		builder.classList.push(...this.classList);
		return builder;
	}

	append(page: CompPage, newParameters?: Partial<RenderableProps<T>>) {
		const dialog = this._create(newParameters);
		page.dialogs.append(dialog);
		page.root.activeDescendant?.focus();
		return dialog;
	}

	private _create(newParameters?: Partial<RenderableProps<T>>) {
		const dialog = new CompDialog<D>();

		const {content: Content} = this;
		dialog.render(<Content {...this.parameters} {...newParameters} />);
		dialog.classList.add(...this.classList);

		return dialog;
	}
}
