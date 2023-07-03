import type {ComponentFactory, RenderableProps} from 'preact';
import assert from '../assert.js';
import type {CompDialog} from './dialog.js';
import {CompList} from './list.js';
import {CompPageContent} from './page-content.js';
import {CompRecord} from './record.js';
import {CompWindow} from './window.js';

export class CompPage extends CompRecord<{
	content: CompPageContent;
	dialogs: CompList<CompDialog<any>>;
}> {
	get content() {
		const content = this.get('content');
		assert(content, 'Page is missing its contents');
		return content;
	}

	get dialogs() {
		const dialogs = this.get('dialogs');
		assert(dialogs, 'Page is missing its dialog list');
		return dialogs;
	}

	constructor(element?: HTMLElement) {
		const content = new CompPageContent();
		const dialogs = new CompList<CompDialog<any>>();

		super(element, {content, dialogs});

		dialogs.addEventListener('ChildrenUpdate', () => {
			const {content, dialogs} = this;
			const activeChild = dialogs.lastChild ?? content;
			content.inert = content !== activeChild;

			for (const dialog of dialogs) {
				activeChild.inert = dialog !== activeChild;
			}
		});
	}

	override get activeDescendant() {
		return this.dialogs.activeDescendant ?? this.content.activeDescendant;
	}
}

export class CompPageBuilder<T = any> {
	readonly classList: string[] = [];

	constructor(
		readonly content: ComponentFactory<T>,
		readonly parameters: RenderableProps<T>,
	) {}

	replace(
		page: CompPage,
		window = page.findNearest(CompWindow),
		newParameters?: Partial<RenderableProps<T>>,
	) {
		assert(window, 'CompWindow not found');
		window.pages.replace(page, this._create(newParameters));
		page.dispose();
	}

	after(
		page: CompPage,
		window = page.findNearest(CompWindow),
		newParameters?: Partial<RenderableProps<T>>,
	) {
		assert(window, 'CompWindow not found');
		window.pages.after(page, this._create(newParameters));
	}

	append(window: CompWindow, newParameters?: Partial<RenderableProps<T>>) {
		window.pages.append(this._create(newParameters));
	}

	private _create(newParameters?: Partial<RenderableProps<T>>) {
		const newPage = new CompPage();
		const {content} = newPage;

		const {content: Content} = this;
		content.render(<Content {...this.parameters} {...newParameters} />);
		content.classList.add(...this.classList);

		return newPage;
	}
}
