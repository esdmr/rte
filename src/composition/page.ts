import type {ComponentChild} from 'preact';
import assert from '../assert.js';
import type {CompDialog} from './dialog.js';
import {CompWindow} from './window.js';
import {CompList} from './list.js';
import {CompLayer} from './layer.js';
import * as css from './page.module.css';
import {CompRecord} from './record.js';

export class CompPage extends CompRecord<{
	content: CompLayer;
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
		const content = new CompLayer(document.createElement('main'));
		const dialogs = new CompList<CompDialog<any>>();

		super(element, {content, dialogs});
		content.classList.add(css.pageContent);

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

export function createPage(options: {
	readonly window?: CompWindow;
	readonly page?: CompPage;
	readonly replace?: boolean;
	readonly content: ComponentChild;
	readonly classes: readonly string[];
}) {
	const window = options.window ?? options.page?.findNearest(CompWindow);
	assert(window, 'Either window or page needs to be provided');

	const newPage = new CompPage();
	const {content} = newPage;

	if (options.replace) {
		assert(options.page, 'You must provide a page to replace');
		window.pages.replace(options.page, newPage);
		options.page.dispose();
	} else if (options.page) {
		window.pages.after(options.page, newPage);
	} else {
		window.pages.append(newPage);
	}

	content.render(options.content);
	content.classList.add(...options.classes);
	content.focus();

	return newPage;
}
